import { Challenge } from "src/modules/challenges/entities/challenge.entity";
import { ChallengeEvaluationStatus } from "src/modules/challenges/evaluators/challenge-evaluator-strategy";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";


export enum ChallengeInterval {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
}

export enum ChallengeDifficulty {
    EASY = 1,
    MEDIUM = 2,
    HARD = 3
}


@Entity({ schema: 'education', name: 'challenge_instances' })
export class ChallengeInstance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @ManyToOne(() => Challenge, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'challenge_id' })
    challenge: Challenge;

    @Column()
    challenge_id: string;

    @Column({
        type: 'enum',
        enum: ChallengeEvaluationStatus,
        default: ChallengeEvaluationStatus.IN_PROGRESS
    })
    status: ChallengeEvaluationStatus;

    @Column()
    progress: Number;


    @Column()
    start_date: Date;

    @Column({
        type: 'enum',
        enum: ChallengeInterval
    })
    interval: ChallengeInterval;

    @Column({
        type: 'enum',
        enum: ChallengeDifficulty
    })
    difficulty: ChallengeDifficulty;

}
