import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

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

    @Column({nullable: true})
    resume?: string
}
