import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Informations personnelles de base
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string; // 'male', 'female', 'other'

  // Sécurité
  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  resetToken: string | null;

  // Rôle dynamique (ADMIN, DOCTOR, NURSE, PATIENT)
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  // Informations hospitalières
  @Column({ nullable: true })
  medicalRecordNumber: string; // pour patients

  @Column({ nullable: true })
  specialization: string; // pour médecins

  @Column({ nullable: true })
  department: string; // pour médecins/infirmiers

  @Column({ nullable: true })
  assignedPatients: string; // liste JSON des patients suivis (ex: pour infirmiers/doctor)

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  emergencyContact: string;

  // Audit
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
