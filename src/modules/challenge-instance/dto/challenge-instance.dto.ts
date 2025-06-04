import { ChallengeEvaluationStatus } from "src/modules/challenges/evaluators/challenge-evaluator-strategy";
import { ChallengeDifficulty, ChallengeInterval } from "../entities/challenge-instance.entity";

export interface ChallengeInstanceDTO {
    id: string;
    challenge_id: string;
    name: string;
    difficulty: ChallengeDifficulty;
    interval: ChallengeInterval;
    progress: number;
    status: ChallengeEvaluationStatus
}

