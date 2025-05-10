import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Family } from '../family/entities/family.entity';

export enum UserRole {
  PARENT = 'parent',
  CHILD = 'child',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity({ schema: 'auth', name: 'users' })
export class User {

  constructor(username: string, email:string, password_hash:string,
    dob: Date, gender: Gender, userRole: UserRole, familyId:number){
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.user_role = userRole;
    this.family_id = familyId;
    this.dob = dob;
    this.gender=gender;
  }

  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  user_role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Family, (family) => family.id, { eager: true })
  @JoinColumn({ name: 'family_id' })
  family: Family;

  @Column()
  family_id: number;

  @Column()
  dob: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  @Column({ nullable: true })
  avatar_path: string;
}
