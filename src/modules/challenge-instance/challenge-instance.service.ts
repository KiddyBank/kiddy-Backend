import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Challenge } from "../challenges/entities/challenge.entity";
import { ChallengeEvalStrategy, ChallengeEvaluationStatus } from "../challenges/evaluators/challenge-evaluator-strategy";
import { RequestPaymentCountEvaluator } from "../challenges/evaluators/request-payment-count-evaluator";
import { SpendLessThanEvaluator } from "../challenges/evaluators/spend-less-than-evaluator";
import { LevelService } from "../levels/levels.service";
import { Transaction } from "../transactions/entities/transaction.entity";
import { UserStats } from "../users-stats/entities/users-stat.entity";
import { UsersService } from "../users/users.service";
import { ChallengeDifficulty, ChallengeInstance, ChallengeInterval } from "./entities/challenge-instance.entity";
import { InjectRepository } from "@nestjs/typeorm";

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
    private readonly levelService: LevelService,
    @InjectRepository(Challenge)
    private readonly challengeRepo: Repository<Challenge>,

  ) { }

  private async getChallengesByCategory(category: string): Promise<Challenge[]> {
    return this.challengeRepo.find({
      where: { category },
    });
  }

  async evaluateActiveChallenges(userId: string): Promise<void> {
    const activeChallenges = await this.challengeInstanceRepo.find({
      where: { status: ChallengeEvaluationStatus.IN_PROGRESS, user_id: userId },
      relations: ['user'],
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

          const newLevel = await this.levelService.evaluateLevel(instance.user_id);
          await this.userStatsRepo.update(
            { user_id: instance.user_id },
            { level_id: newLevel }
          );
          const levelCategory = await this.levelService.getLevelCategory(newLevel);

          await this.challengeInstanceRepo.delete({ user_id: instance.user_id });
          const generated: ChallengeInstance = await this.generateNewChallenge(instance, levelCategory);
          await this.challengeInstanceRepo.save(generated);
        }
      }
    }
  }

  private async generateNewChallenge(oldChallenge: ChallengeInstance, category: string): Promise<ChallengeInstance> {
    const challenges: Challenge[] = await this.getChallengesByCategory(category);
    const now = new Date();

    const randomIndex = Math.floor(Math.random() * challenges.length);
    const selectedChallenge = challenges[randomIndex];

    const instance = new ChallengeInstance();
    instance.user_id = oldChallenge.user_id;
    instance.challenge_id = selectedChallenge.id;
    instance.status = ChallengeEvaluationStatus.IN_PROGRESS;
    instance.difficulty = this.getRandomDifficulty();
    instance.interval = oldChallenge.interval;
    instance.start_date = now;
    instance.progress = 0;
    return instance;
  }

  private getRandomDifficulty(): ChallengeDifficulty {
    const difficulties = Object.values(ChallengeDifficulty) as ChallengeDifficulty[];
    const index = Math.floor(Math.random() * difficulties.length);
    return difficulties[index];
  }


  async getUserChallengesWithLevel(userId: string): Promise<{ challenges: ChallengeInstance[], level: number, category: string }> {
    const challenges = await this.challengeInstanceRepo.find({
      where: { user_id: userId, status: ChallengeEvaluationStatus.IN_PROGRESS },
      relations: ['challenge'],
    });

    const userLevel = await this.levelService.getUserLevel(userId);
    const category = await this.levelService.getLevelCategory(userLevel);

    return { challenges, level: userLevel, category };
  }

  async generateInitialChallenges(userId: string): Promise<void> {
    const category = await this.levelService.getLevelCategory(1);
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
