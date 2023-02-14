import { compare } from "bcrypt"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from "typeorm"
import { Address } from "./Address"

@Entity("students")
export class Student {

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

    @OneToOne(() => Address, (address) => address.student,{ lazy: true })
    address: Address;

    comparePwd = async (pwdString: string): Promise<boolean> => {
        return await compare(pwdString, this.password)
    }
}
