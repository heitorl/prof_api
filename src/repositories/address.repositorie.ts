import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Address } from "../entities";

interface IAddressRepo {
  save: (address: Partial<Address>) => Promise<Address>;
  all: () => Promise<Address[]>;
  findOne: (payload: object) => Promise<Address>;
}

class addressRepositorie implements IAddressRepo {
  private ormRepo: Repository<Address>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Address);
  }

  save = async (address: Partial<Address>) => await this.ormRepo.save(address);

  all = async () => await this.ormRepo.find();

  findOne = async (payload: object) => {
    return await this.ormRepo.findOneBy({ ...payload });
  };
}

export default new addressRepositorie();