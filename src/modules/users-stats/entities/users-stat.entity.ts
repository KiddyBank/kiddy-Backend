import { Level } from "src/modules/levels/entities/level.entity";
import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column, UpdateDateColumn } from "typeorm";

@Entity({ schema: 'education', name: 'user_stats' })
export class UserStats {
    @PrimaryColumn() user_id: string;

    @OneToOne(() => Level)
    @JoinColumn({ name: 'level_id' })
    level: Level;

    @Column({ nullable: true })
    level_id: number;

    @Column({ type: 'int', default: 0 })
    total_xp: number;

    @Column({ type: 'int', default: 0 })
    current_level_xp: number;

    @UpdateDateColumn() updated_at: Date;
}
