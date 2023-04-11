import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Assessments } from "../entities/Assessments";

interface IAssessmentRepo {
  save: (assessment: Partial<Assessments>) => Promise<Assessments>;
  all: () => Promise<Assessments[]>;
  findOne: (payload: object) => Promise<Assessments>;
}

class assessmentRepositorie implements IAssessmentRepo {
  private ormRepo: Repository<Assessments>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Assessments);
  }

  save = async (assessment: Partial<Assessments>) => await this.ormRepo.save(assessment);

  all = async () => await this.ormRepo.find();

  findOne = async (payload: object) => {
    return await this.ormRepo.findOneBy({ ...payload });
  };
}

export default new assessmentRepositorie();