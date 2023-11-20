import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Teacher } from "./Teacher";

@Entity("curriculum")
export class Curriculum {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "json", nullable: true })
  formation?: {
    academicDegree: string;
    studyArea: string;
    institution: string;
  }[];

  @Column({ type: "json", nullable: true })
  professional_experience?: {
    position: string;
    company: string;
    startDate: Date;
    endDate?: Date;
  }[];

  @Column({ nullable: true })
  celullar?: string;

  @Column({
    nullable: true,
    default:
      '["Adcione aqui um resumo sobre você e sua carreira profissional"]',
  })
  resume?: string;

  @OneToOne(() => Teacher, (teacher) => teacher.curriculum)
  @JoinColumn()
  teacher: Teacher;
}
