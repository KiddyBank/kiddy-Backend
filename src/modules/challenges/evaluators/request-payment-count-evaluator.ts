import { ChallengeDifficulty, ChallengeInterval } from "src/modules/challenge-instance/entities/challenge-instance.entity";
import { Transaction, TransactionStatus, TransactionType } from "src/modules/transactions/entities/transaction.entity";
import { UsersService } from "src/modules/users/users.service";
import { getChallengeEndDate } from "src/utils/challenges";
import { In, MoreThanOrEqual, Repository } from "typeorm";
import { AbstractChallengeEvaluator } from "./base-challenge-strategy";
import { ChallengeEvaluationStatus } from "./challenge-evaluator-strategy";

export class RequestPaymentCountEvaluator extends AbstractChallengeEvaluator<{ requiredCount: number }> {
  constructor(
    private readonly transactionsRepo: Repository<Transaction>,
    private readonly userService: UsersService
  ) {
    super({ requiredCount: 3 }, 10,
      {
        [ChallengeDifficulty.EASY]: 1,
        [ChallengeDifficulty.MEDIUM]: 2,
        [ChallengeDifficulty.HARD]: 3,
      }, {
      [ChallengeInterval.DAILY]: 1,
      [ChallengeInterval.WEEKLY]: 1.5,
      [ChallengeInterval.MONTHLY]: 2,
    });
  }

  async eval(
    userId: string,
    difficulty: ChallengeDifficulty,
    interval: ChallengeInterval,
    startDate: Date
  ): Promise<[ChallengeEvaluationStatus, number, number]> {
    const scaledParams = this.scaleParams(difficulty, interval);
    const balance = await this.userService.getChildBalanceFromUuid(userId);

    const count = await this.transactionsRepo.count({
      where: {
        balance_id: balance.balance_id,
        type: TransactionType.STORE_PURCHASE,
        status: In([
          TransactionStatus.COMPLETED,
          TransactionStatus.APPROVED_BY_PARENT,
          TransactionStatus.PENDING_PARENT_APPROVAL,
        ]),
        created_at: MoreThanOrEqual(startDate),
      },
    });

    const progress = Math.min(count / scaledParams.requiredCount, 1);
    const now = new Date();
    const endDate = getChallengeEndDate(startDate, interval);

    if (progress >= 1) {
      return [ChallengeEvaluationStatus.COMPLETED, progress, this.baseXp * difficulty.valueOf()];
    }

    if (now >= endDate) {
      return [ChallengeEvaluationStatus.FAILED, progress, 0];
    }

    return [ChallengeEvaluationStatus.IN_PROGRESS, progress, 0];
  }


}
