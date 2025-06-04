import { ChallengeDifficulty, ChallengeInterval } from "src/modules/challenge-instance/entities/challenge-instance.entity";

export interface ChallengeEvalStrategy {
    eval(userId: string, difficulty: ChallengeDifficulty, interval: ChallengeInterval, startDate: Date):
        Promise<[ChallengeEvaluationStatus, number, number]>;

    getParamTemplatedMessage(template: string, difficulty: ChallengeDifficulty, interval: ChallengeInterval): string;

}


export enum ChallengeEvaluationStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export class ChallengeEvaluationResult {
    constructor(
        public readonly status: ChallengeEvaluationStatus,
        public readonly progress?: number, // normalized 0-1
    ) { }

}
