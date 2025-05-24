import { InjectRepository } from "@nestjs/typeorm";
import { ChallengeDifficulty, ChallengeInterval } from "src/modules/challenge-instance/entities/challenge-instance.entity";
import { Transaction, TransactionStatus, TransactionType } from "src/modules/transactions/entities/transaction.entity";
import { UsersService } from "src/modules/users/users.service";
import { getChallengeEndDate } from "src/utils/challenges";
import { In, MoreThanOrEqual, Repository } from "typeorm";
import { AbstractChallengeEvaluator } from "./base-challenge-strategy";
import { ChallengeEvaluationStatus } from "./challenge-evaluator-strategy";


export class SpendLessThanEvaluator extends AbstractChallengeEvaluator<{ maxAmount: number }> {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionsRepo: Repository<Transaction>,
        private readonly userService: UsersService
    ) {
        super(
            { maxAmount: 150 }, 8,

            {
                [ChallengeDifficulty.EASY]: 1.2,
                [ChallengeDifficulty.MEDIUM]: 1,
                [ChallengeDifficulty.HARD]: 0.7,
            },
            {
                [ChallengeInterval.DAILY]: 1,
                [ChallengeInterval.WEEKLY]: 1.5,
                [ChallengeInterval.MONTHLY]: 2,
            }
        );
    }

    async eval(
        userId: string,
        difficulty: ChallengeDifficulty,
        interval: ChallengeInterval,
        startDate: Date
    ): Promise<[ChallengeEvaluationStatus, number, number]> {

        const balance = await this.userService.getChildBalanceFromUuid(userId);
        const scaledParams = this.scaleParams(difficulty, interval);

        const transactions = await this.transactionsRepo.find({
            where: {
                balance_id: balance.balance_id,
                type: TransactionType.STORE_PURCHASE,
                status: In([
                    TransactionStatus.COMPLETED,
                    TransactionStatus.APPROVED_BY_PARENT,
                ]),
                created_at: MoreThanOrEqual(startDate),
            },
        });

        const totalSpent = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
        const progress = 1 - Math.min(totalSpent / scaledParams.maxAmount, 1);

        const endDate = getChallengeEndDate(startDate, interval);
        const now = new Date();

        if (progress >= 1) {
            return [ChallengeEvaluationStatus.FAILED, progress, 0];
        }

        if (now > endDate) {
            return [ChallengeEvaluationStatus.COMPLETED, progress, this.baseXp * difficulty.valueOf()];
        }

        return [ChallengeEvaluationStatus.IN_PROGRESS, progress, 0];
    }

}
