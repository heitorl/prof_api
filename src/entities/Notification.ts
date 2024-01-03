import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Student } from "./Student";
import { Teacher } from "./Teacher";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  content: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @ManyToOne(() => Student, { nullable: true, eager: true })
  senderStudent: Student;

  @ManyToOne(() => Teacher, { nullable: true, eager: true })
  senderTeacher: Teacher;

  @ManyToOne(() => Student, { nullable: true })
  receiverStudent: Student;

  @ManyToOne(() => Teacher, { nullable: true })
  receiverTeacher: Teacher;
}
