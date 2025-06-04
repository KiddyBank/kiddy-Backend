import { ChallengeDifficulty, ChallengeInterval } from "src/modules/challenge-instance/entities/challenge-instance.entity";
import { ChallengeEvalStrategy, ChallengeEvaluationStatus } from "./challenge-evaluator-strategy";
import { fillPlaceholders } from "src/utils/challenges";

export abstract class AbstractChallengeEvaluator<TParams> implements ChallengeEvalStrategy {

  constructor(protected params: TParams,
    protected readonly baseXp: number,
    protected readonly difficultyMultiplier: Record<ChallengeDifficulty, number>,
    protected readonly intervalMultiplier: Record<ChallengeInterval, number>
  ) {
  }

  abstract eval(userId: string, difficulty: ChallengeDifficulty, interval: ChallengeInterval, startDate: Date):
    Promise<[ChallengeEvaluationStatus, number, number]>;

  getParamTemplatedMessage(template: string, difficulty: ChallengeDifficulty, interval: ChallengeInterval): string {
    const scaledParams = this.scaleParams(difficulty, interval);
    return fillPlaceholders(template, scaledParams as Record<string, any>);

  }

  // Scale based on difficulty & interval
  scaleParams(difficulty: ChallengeDifficulty, interval: ChallengeInterval): TParams {
    const difficultyMult = this.difficultyMultiplier[difficulty] ?? 1;
    const intervalMult = this.intervalMultiplier[interval] ?? 1;

    const scaled: Partial<Record<keyof TParams, number>> = {};

    for (const key in this.params) {
      const baseValue = this.params[key] as number;
      scaled[key] = Math.ceil(baseValue * difficultyMult * intervalMult);
    }

    return scaled as TParams;
  }


}