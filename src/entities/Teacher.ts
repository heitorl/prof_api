import { compare } from "bcrypt"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, GridFSBucketReadStream, ManyToOne } from "typeorm"
import { Address } from "./Address"
import { Assessments } from "./Assessments"
import { Curriculum } from "./Curriculum"
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

    @OneToMany(() => Discipline, (discipline) => discipline.teacher, { eager: true })
    disciplines: Discipline[]

    @OneToMany(() => Assessments, (assessment) => assessment.teacher, { eager: true } )
    assessment: Assessments[];

    @OneToOne(() => Address, (address) => address.teacher, { eager: true })
    address: Address;

    @OneToOne(() => Curriculum, (curriculum) => curriculum.teacher, { eager: true })
    curriculum: Curriculum;

    comparePwd = async (pwdString: string): Promise<boolean> => {
        return await compare(pwdString, this.password)
    }
}
