import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Teacher } from "./Teacher";
import { Student } from "./Student";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt?: Date;

  @ManyToOne(() => Student, { nullable: true })
  senderStudent: Student;

  @ManyToOne(() => Teacher, { nullable: true })
  senderTeacher: Teacher;

  @ManyToOne(() => Student, { nullable: true })
  receiverStudent: Student;

  @ManyToOne(() => Teacher, { nullable: true })
  receiverTeacher: Teacher;
}
