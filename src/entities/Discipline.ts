import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Teacher } from "./Teacher";

@Entity("discipline")
export class Discipline {

    @PrimaryGeneratedColumn("uuid")
    id?: string

    @Column('json', { nullable: true })
    disciplines: string[];


    @ManyToOne(() => Teacher, (teacher) => teacher.disciplines)
    teacher: Teacher;
    
}
