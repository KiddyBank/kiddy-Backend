import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ChallengeEvalStrategy } from '../evaluators/challenge-evaluator-strategy';

@Entity({ schema: 'education', name: 'challenges' })
export class Challenge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    category: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    evaluator?: ChallengeEvalStrategy;

}
