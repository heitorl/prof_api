import { compare } from "bcrypt"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from "typeorm"
import { Address } from "./Address"
import { Discipline } from "./Discipline"

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

    @CreateDateColumn()
    createdAt?: Date 

    @UpdateDateColumn()
    updatedAt?: Date

    @OneToMany(() => Discipline, (discipline) => discipline.teacher)
    disciplines: Discipline[]

    @OneToOne(() => Address, (address) => address.teacher, { lazy: true })
    address: Address;

    comparePwd = async (pwdString: string): Promise<boolean> => {
        return await compare(pwdString, this.password)
    }
}
