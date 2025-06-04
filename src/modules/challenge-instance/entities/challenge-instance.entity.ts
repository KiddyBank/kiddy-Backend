import { Challenge } from "src/modules/challenges/entities/challenge.entity";
import { ChallengeEvaluationStatus } from "src/modules/challenges/evaluators/challenge-evaluator-strategy";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";


export enum ChallengeInterval {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'monthly'
}

export enum ChallengeDifficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD'
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

    @Column('decimal', { precision: 6, scale: 2 })
    progress: number;


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
