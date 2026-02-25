import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity('roles')
export class Role {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // ex: 'ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'

  @Column({ nullable: true })
  description: string; // description du rôle

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => User, user => user.role)
  users: User[];
}