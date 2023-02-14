import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Teacher } from "../entities";


interface ITeacherRepo {
  save: (teacher: Partial<Teacher>) => Promise<Teacher>;
  all: () => Promise<Teacher[]>;
  findOne: (payload: object) => Promise<Teacher>;
}

class TeacherRepositorie implements ITeacherRepo {
  private ormRepo: Repository<Teacher>

  constructor () {
    this.ormRepo = AppDataSource.getRepository(Teacher)
  }

  save = async (teacher: Partial<Teacher>) => await this.ormRepo.save(teacher)

  all = async () => await this.ormRepo.find();

  findOne = async (payload: object) => await this.ormRepo.findOneBy({ ...payload }) 

}


export default new TeacherRepositorie()