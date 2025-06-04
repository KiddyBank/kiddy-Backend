import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Challenge } from "../challenges/entities/challenge.entity";
import { ChallengeEvalStrategy, ChallengeEvaluationStatus } from "../challenges/evaluators/challenge-evaluator-strategy";
import { RequestPaymentCountEvaluator } from "../challenges/evaluators/request-payment-count-evaluator";
import { SpendLessThanEvaluator } from "../challenges/evaluators/spend-less-than-evaluator";
import { Transaction } from "../transactions/entities/transaction.entity";
import { UserStats } from "../users-stats/entities/users-stat.entity";
import { UsersStatsService } from "../users-stats/users-stats.service";
import { UsersService } from "../users/users.service";
import { ActiveChallengesResponseDTO } from "./dto/active-challenges.dto";
import { ChallengeInstanceDTO } from "./dto/challenge-instance.dto";
import { ChallengeDifficulty, ChallengeInstance, ChallengeInterval } from "./entities/challenge-instance.entity";

@Injectable()
export class ChallengeEvaluatorFactory {
  private evaluators: Partial<Record<string, ChallengeEvalStrategy>>;


  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepo: Repository<Transaction>,

    private readonly userService: UsersService,

  ) {
    const requestPaymentCountEvaluator = new RequestPaymentCountEvaluator(transactionsRepo, userService);
    const spendLessThanEvaluator = new SpendLessThanEvaluator(transactionsRepo, userService);

    this.evaluators = {
      ["PAYMENT_REQUEST_COUNT"]: requestPaymentCountEvaluator,
      ["SPEND_LESS_THAN"]: spendLessThanEvaluator
    };
  }

  getEvaluator(type: string): ChallengeEvalStrategy {
    const evaluator = this.evaluators[type];
    if (!evaluator) {
      throw new Error(`No evaluator registered for challenge type: ${type}`);
    }
    return evaluator;
  }
}


@Injectable()
export class ChallengeInstanceService {
  constructor(
    @InjectRepository(ChallengeInstance)
    private readonly challengeInstanceRepo: Repository<ChallengeInstance>,
    @InjectRepository(UserStats)
    private readonly userStatsRepo: Repository<UserStats>,
    private readonly challengeFactory: ChallengeEvaluatorFactory,
    private readonly userStatsService: UsersStatsService,
    @InjectRepository(Challenge)
    private readonly challengeRepo: Repository<Challenge>,

  ) { }

  private async getChallengesByCategory(category: string): Promise<Challenge[]> {
    return this.challengeRepo.find({
      where: { category },
    });
  }

  async evaluateActiveChallenges(userId: string): Promise<void> {
    console.log(`Evaluating challenges for user: ${userId}`);
    const activeChallenges = await this.challengeInstanceRepo.find({
      where: { status: ChallengeEvaluationStatus.IN_PROGRESS, user_id: userId },
      relations: ['challenge'],
    });

    for (const instance of activeChallenges) {
      const evaluator = this.challengeFactory.getEvaluator(instance.challenge.type);

      const [status, progress, earnedXp] = await evaluator.eval(
        instance.user_id,
        instance.difficulty,
        instance.interval,
        instance.start_date,
      );

      instance.status = status;
      instance.progress = progress;


      await this.challengeInstanceRepo.save(instance);

      if (status === ChallengeEvaluationStatus.COMPLETED || status === ChallengeEvaluationStatus.FAILED) {
        {
          await this.userStatsRepo.increment({ user_id: instance.user_id }, 'current_level_xp', earnedXp);
          await this.userStatsRepo.increment({ user_id: instance.user_id }, 'total_xp', earnedXp);

          const newLevel = await this.userStatsService.evaluateLevel(instance.user_id);

          const levelCategory = await this.userStatsService.getLevelCategory(newLevel);
          await this.challengeInstanceRepo.delete({ id: instance.id });
          const generated: ChallengeInstance = await this.generateNewChallenge(instance, levelCategory);
          await this.challengeInstanceRepo.save(generated);
        }
      }
    }
  }

  private async generateNewChallenge(oldChallenge: ChallengeInstance, category: string): Promise<ChallengeInstance> {
    console.log(`Generating new challenge for user ${oldChallenge.user_id} in category ${category}`);
    const challenges: Challenge[] = await this.getChallengesByCategory(category);

    console.log(challenges)

    const randomIndex = Math.floor(Math.random() * challenges.length);
    const selectedChallenge = challenges[randomIndex];


    const instance = new ChallengeInstance();
    instance.user_id = oldChallenge.user_id;
    instance.challenge_id = selectedChallenge.id;
    instance.status = ChallengeEvaluationStatus.IN_PROGRESS;
    instance.difficulty = this.getRandomDifficulty();
    instance.interval = oldChallenge.interval;
    return instance;
  }

  private getRandomDifficulty(): ChallengeDifficulty {
    const difficulties = Object.values(ChallengeDifficulty) as ChallengeDifficulty[];
    const index = Math.floor(Math.random() * difficulties.length);
    return difficulties[index];
  }


  async getUserChallengesWithLevel(userId: string): Promise<ActiveChallengesResponseDTO> {
    const challenges = await this.challengeInstanceRepo.find({
      where: { user_id: userId, status: ChallengeEvaluationStatus.IN_PROGRESS },
      relations: ['challenge'],
    });

    console.log(userId)
    const userLevel = await this.userStatsService.getUserLevel(userId);
    const category = await this.userStatsService.getLevelCategory(userLevel);


    const mapped_challenges: ChallengeInstanceDTO[] = challenges.map(ci => ({
      id: ci.id,
      challenge_id: ci.challenge_id,
      name: this.challengeFactory.getEvaluator(ci.challenge.type).getParamTemplatedMessage(ci.challenge.name, ci.difficulty, ci.interval),
      difficulty: ci.difficulty as ChallengeDifficulty,
      interval: ci.interval as ChallengeInterval,
      progress: ci.progress,
      status: ci.status as ChallengeEvaluationStatus,
    }));

    return {
      challenges: mapped_challenges,
      level: userLevel,
      category,
    };
  }

  async generateInitialChallenges(userId: string): Promise<void> {
    const category = await this.userStatsService.getLevelCategory(1);
    const challenges: Challenge[] = await this.getChallengesByCategory(category);
    const now = new Date();

    const instances: ChallengeInstance[] = [];

    for (const interval of Object.values(ChallengeInterval)) {
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * challenges.length);
        const selectedChallenge = challenges[randomIndex];

        const instance = new ChallengeInstance();
        instance.user_id = userId;
        instance.challenge_id = selectedChallenge.id;
        instance.status = ChallengeEvaluationStatus.IN_PROGRESS;
        instance.difficulty = this.getRandomDifficulty();
        instance.interval = interval;
        instance.start_date = now;
        instance.progress = 0;

        instances.push(instance);
      }
    }

    await this.challengeInstanceRepo.save(instances);
  }

}
