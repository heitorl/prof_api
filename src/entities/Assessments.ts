import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Student } from "./Student";
import { Teacher } from "./Teacher";

@Entity("assessments")
export class Assessments {

    @PrimaryGeneratedColumn("uuid")
    id?: string

    @Column()
    detail: string

    @Column()
    note: Number
    

    @ManyToOne(() => Student, (student) => student.assessment, { eager: true } )
    student: Student;

    @ManyToOne(() => Teacher, (teacher) => teacher.assessment, { eager: true })
    teacher: Teacher;
    
}
