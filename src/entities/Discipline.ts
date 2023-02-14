import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Teacher } from "./Teacher";

@Entity("discipline")
export class Discipline {

    @PrimaryGeneratedColumn("uuid")
    id?: string

    @Column()
    name: string

    @ManyToOne(() => Teacher, (teacher) => teacher.disciplines)
    teacher: Teacher;
    
}
