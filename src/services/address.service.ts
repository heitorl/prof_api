import { Request } from "express";
import { Address, Student, Teacher } from "../entities";
import { addressRepositorie, StudentRepositorie } from "../repositories";
import teacherRepositorie from "../repositories/teacher.repositorie";
import { serializedCreateAddressSchema } from "../schemas";
import { formatcepAddressUtil } from "../utils/formatCepAddress.util";
import { AppDataSource } from "../data-source";

interface AddressUpdateData {
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  number?: number;
  cep?: string;
  teacher?: Teacher;
  student?: Student;
}

class AddressService {
  createAddress = async ({ validated, decoded }: Request) => {
    const teacher = await teacherRepositorie.findOne({
      id: decoded.id,
    });

    const student: Student = await StudentRepositorie.findOne({
      id: decoded.id,
    });

    const user = teacher || student;

    (validated as Address).cep = formatcepAddressUtil(validated as Address);

    const addressData: AddressUpdateData = {
      ...(validated as Address),
    };

    try {
      if (teacher) {
        addressData.teacher = teacher;
      } else if (student) {
        addressData.student = student;
      }

      if (!user.address) {
        const address: Address = await addressRepositorie.save(addressData);

        return await serializedCreateAddressSchema.validate(address, {
          stripUnknown: true,
        });
      } else {
        const updateData: AddressUpdateData = {
          street: addressData.street,
          neighborhood: addressData.neighborhood,
          city: addressData.city,
          state: addressData.state,
          number: addressData.number,
          cep: addressData.cep,
        };

        const returnWithoutUserData = updateData;

        if (teacher) {
          updateData.teacher = addressData.teacher;
        } else if (student) {
          updateData.student = addressData.student;
        }

        await AppDataSource.getRepository(Address).update(
          user.address.id,
          updateData
        );

        return returnWithoutUserData;
      }
    } catch (error) {
      throw new Error("Erro ao atualizar o endereço.");
    }
  };
}

export default new AddressService();
