import { Level } from "src/modules/levels/entities/level.entity";
import { User } from "src/modules/users/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";

@Entity({ schema: 'education', name: 'user_stats' })
export class UserStats {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne(() => Level)
    @JoinColumn({ name: 'level_id' })
    level: Level;

    @Column({ nullable: true })
    level_id: number;

    @Column({ type: 'int', default: 0 })
    total_xp: number;

    @Column({ type: 'int', default: 0 })
    current_level_xp: number;

    @UpdateDateColumn()
    updated_at: Date;
}
