import { sign } from "jsonwebtoken";
import { Request } from "express"
import { Teacher } from "../entities"
import teacherRepositorie from "../repositories/teacher.repositorie"
import * as env from "dotenv"
import { AssertsShape } from "yup/lib/object";
import { hash } from "bcrypt";
import { serializedCreateTeacherSchema } from "../schemas";
import { deleteFile } from "../utils/file";
import { returnUserWithOutPassword } from "../utils/serializedAddresTeacher.util";

env.config()

interface iTeacherLogin {
  status: number,
  message: object
}

class TeacherService {

  login = async ({validated}: Request): Promise<iTeacherLogin> => {

    const teacher: Teacher = await teacherRepositorie.findOne({
      email: (validated as Teacher).email
    })

    if(!teacher){
      return {
        status: 401,
        message: {message: "Invalid Credentials"}
      }
    }

    if(!(await teacher.comparePwd((validated as Teacher).password))){
      return {
        status: 401,
        message: {message: "Invalid Credentials"}
      }
    }

    const token: string = sign(
      {
        id: teacher.id,
        email: teacher.email,
        name: teacher.name,

      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_IN,
      }
    );

    const user = returnUserWithOutPassword({...teacher })

    return { status: 200, message: { user, token }}
  }

  register = async({ validated }: Request): Promise<AssertsShape<any>> => {
    (validated as Teacher).password = await hash((validated as Teacher).password, 10);
    const teacher: Teacher = await teacherRepositorie.save(validated as Teacher);
    
    return await serializedCreateTeacherSchema.validate(teacher, {
      stripUnknown: true,
    });
  }

  updateTeacherAvatar = async ({ decoded }: Request, avatarFile : string): Promise<void> => {
    const teacher: Teacher = await teacherRepositorie.findOne({id: (decoded as Teacher).id})
    if(teacher.avatar)
      await deleteFile(`./src/tmp/teacherAvatar/${teacher.avatar}`)   
    
    teacher.avatar = avatarFile

    await teacherRepositorie.save(teacher)   

  }


}

export default new TeacherService()