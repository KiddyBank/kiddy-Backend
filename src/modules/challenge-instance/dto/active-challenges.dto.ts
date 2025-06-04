import { ChallengeInstanceDTO } from "./challenge-instance.dto";

export interface ActiveChallengesResponseDTO {
    challenges: ChallengeInstanceDTO[];
    level: number;
    category: string;
}
