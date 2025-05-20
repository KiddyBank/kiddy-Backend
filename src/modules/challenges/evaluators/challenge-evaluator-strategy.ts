import { ChallengeDifficulty, ChallengeInterval } from "src/modules/challenge-instance/entities/challenge-instance.entity";

export interface ChallengeEvalStrategy {
    eval(userId: string, difficulty: ChallengeDifficulty, interval: ChallengeInterval, startDate: Date):
        Promise<[ChallengeEvaluationStatus, number, number]>;
}


export enum ChallengeEvaluationStatus {
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export class ChallengeEvaluationResult {
    constructor(
        public readonly status: ChallengeEvaluationStatus,
        public readonly progress?: number, // normalized 0-1
    ) { }

}
