import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ schema: 'education', name: 'levels' })
export class Level {
    @PrimaryGeneratedColumn() id: number;

    @Column() name: string;

    @Column() category: string;

    @Column({ type: 'int' })
    xp_required: number;

    @CreateDateColumn() created_at: Date;
}
