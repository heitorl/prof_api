import { compare } from "bcrypt"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, GridFSBucketReadStream, ManyToOne } from "typeorm"
import { Address } from "./Address"
import { Assessments } from "./Assessments"
import { Discipline } from "./Discipline"
import { Student } from "./Student"

@Entity("teachers")
export class Teacher {

    @PrimaryGeneratedColumn("uuid")
    id?: string

    @Column()
    name: string

    @Column()
    lastName: string

    @Column({unique: true})
    email: string

    @Column()
    password: string

    // @Column()
    // grades: Array;

    // @Column()
    // gradesAll: Number;

    @Column({nullable: true})
    avatar: string

    @CreateDateColumn()
    createdAt?: Date 

    @UpdateDateColumn()
    updatedAt?: Date

    @OneToMany(() => Discipline, (discipline) => discipline.teacher)
    disciplines: Discipline[]

    @OneToMany(() => Assessments, (assessment) => assessment.teacher, { lazy: true } )
    assessment: Assessments[];

    @OneToOne(() => Address, (address) => address.teacher, { lazy: true })
    address: Address;

    comparePwd = async (pwdString: string): Promise<boolean> => {
        return await compare(pwdString, this.password)
    }
}
