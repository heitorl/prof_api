import { compare } from "bcrypt";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Address } from "./Address";
import { Assessments } from "./Assessments";
import { Teacher } from "./Teacher";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Assessments, (assessment) => assessment.student, {
    lazy: true,
  })
  assessment: Assessments[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToOne(() => Address, (address) => address.student, { eager: true })
  address: Address;

  comparePwd = async (pwdString: string): Promise<boolean> => {
    return await compare(pwdString, this.password);
  };
}
