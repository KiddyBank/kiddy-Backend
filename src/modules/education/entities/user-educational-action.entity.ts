import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('user_educational_actions', { schema: 'education' })
@Unique(['user_id', 'action_type'])
export class UserEducationalAction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: string;

    @Column()
    action_type: string;

    @Column({ default: false })
    first_action_completed: boolean;

    @Column({ type: 'timestamp', nullable: true })
    completed_at: Date;

    @Column({ type: 'jsonb', default: {} })
    event_params: Record<string, any>;
}
