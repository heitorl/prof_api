import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm"
import { Teacher } from "./Teacher"

@Entity("curriculum")
export class Curriculum {

    @PrimaryGeneratedColumn("uuid")
    id?: string

    @Column({unique: true})
    cpf: string

    @Column({nullable: true})
    formation?: string

    @Column({nullable: true})
    skills?: string   

    @Column({nullable: true})
    professional_experience?: string

    @Column({nullable: true})
    linkedin?: string

    @Column({nullable: true})
    celullar?: string

    @Column({nullable: true , default: '["Adcione aqui um resumo sobre você e sua carreira profissional"]'})
    resume?: string

    @OneToOne(() => Teacher, (teacher) => teacher.curriculum)
    @JoinColumn()
    teacher: Teacher;
}
