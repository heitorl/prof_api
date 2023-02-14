import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Student } from "../entities";


interface IStudentRepo {
  save: (student: Partial<Student>) => Promise<Student>;
  all: () => Promise<Student[]>;
  findOne: (payload: object) => Promise<Student>;
}

class StudentRepositorie implements IStudentRepo {
  private ormRepo: Repository<Student>

  constructor () {
    this.ormRepo = AppDataSource.getRepository(Student)
  }

  save = async (student: Partial<Student>) => await this.ormRepo.save(student)

  all = async () => await this.ormRepo.find();

  findOne = async (payload: object) => await this.ormRepo.findOneBy({ ...payload }) 

}


export default new StudentRepositorie()