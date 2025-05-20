import { ChallengeInterval } from "src/modules/challenge-instance/entities/challenge-instance.entity";
import { addDays } from "date-fns";

export function getChallengeEndDate(startDate: Date, interval: ChallengeInterval): Date {
    switch (interval) {
        case ChallengeInterval.DAILY:
            return addDays(startDate, 1);
        case ChallengeInterval.WEEKLY:
            return addDays(startDate, 7);
        case ChallengeInterval.MONTHLY:
            return addDays(startDate, 30);
        default:
            return addDays(startDate, 7);
    }
}
