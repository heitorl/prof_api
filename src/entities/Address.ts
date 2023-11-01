import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { Student } from "./Student"
import { Teacher } from "./Teacher"

@Entity("address")
export class Address {

    @PrimaryGeneratedColumn("uuid")
    id?: string

    @Column()
    street: string

    @Column()
    city: string

    @Column()
    state: string

    @Column()
    number: number

    @Column()
    cep: string

    @OneToOne(() => Teacher, (teacher) => teacher.address)
    @JoinColumn()
    teacher: Teacher;

    @OneToOne(() => Student, (student) => student.address, { nullable: true })
    @JoinColumn()
    student: Student;

}
