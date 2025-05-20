import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('educational_content_templates', { schema: 'education' })
export class EducationalContentTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    action_type: string;

    @Column()
    content_type: 'video' | 'tip' | 'booster';

    @Column()
    content_payload: string;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    created_at: Date;
}
