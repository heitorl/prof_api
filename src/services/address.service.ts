import { Request } from "express";
import { Address, Student, Teacher } from "../entities";
import { addressRepositorie, StudentRepositorie } from "../repositories";
import teacherRepositorie from "../repositories/teacher.repositorie";
import { serializedCreateAddressSchema } from "../schemas";
import { formatcepAddressUtil } from "../utils/formatCepAddress.util";

class AddressService {

  createAddress = async ({ validated, decoded }: Request) => {
  
    const teacher = await teacherRepositorie.findOne({
      id: decoded.id,
    });

    const student: Student = await StudentRepositorie.findOne({
      id: decoded.id
    })

    if(teacher){
      (validated as Address).cep = formatcepAddressUtil((validated as Address))
      console.log(validated as Address)
      
      const address: Address = await addressRepositorie.save({...(validated as Address), teacher})

      return await serializedCreateAddressSchema.validate(address, {
        stripUnknown: true,
      })
    }else{      
    
      (validated as Address).cep = formatcepAddressUtil((validated as Address))
      const address: Address = await addressRepositorie.save({...(validated as Address), student})

      return await serializedCreateAddressSchema.validate(address, {
        stripUnknown: true,
      })
    }   
    
  }
  
}

export default new AddressService()