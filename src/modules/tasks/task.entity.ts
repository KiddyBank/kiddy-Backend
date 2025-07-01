import { User } from 'src/modules/users/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToMany,
    JoinTable,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  
  @Entity({ schema: 'finance', name: 'tasks' })
  export class Task {
    @PrimaryGeneratedColumn('uuid')
    task_id: string;
  
    @Column({ type: 'varchar', length: 255 })
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @Column({ type: 'double precision' })
    payment_amount: number;
  
    @Column({ type: 'int' })
    monthly_limit: number;
  
    @Column({ type: 'int', nullable: true })
    balance_id?: number;
  
    @Column({ type: 'text', nullable: true })
    task_status?: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @ManyToOne(() => User, (user) => user.user_id, { eager: true })
    @JoinColumn({ name: 'author_parent_id' })
    author_parent: User;
  
    @Column('uuid', { array: true })
    child_ids: string[];
    
    children: User[];
  }
  