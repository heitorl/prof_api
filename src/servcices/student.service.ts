import { sign } from "jsonwebtoken";
import { Request } from "express"
import * as env from "dotenv"
import { AssertsShape } from "yup/lib/object";
import { hash } from "bcrypt";
import { Student, Teacher } from "../entities";
import { addressRepositorie, StudentRepositorie } from "../repositories";
import studentRepositorie from "../repositories/student.repositorie";
import { serializedCreateStudentSchema } from "../schemas";
import teacherRepositorie from "../repositories/teacher.repositorie";
import { requestDistanceMaps } from "../requests"
import { serializedAddressTeacherUtil } from "../utils/serializedAddresTeacher.util";

env.config()

interface iStudentLogin {
  status: number,
  message: object
}

class StudentService {

  login = async ({validated}: Request): Promise<iStudentLogin> => {

    const student: Student = await StudentRepositorie.findOne({
      email: (validated as Student).email
    })

    if(!student){
      return {
        status: 401,
        message: {message: "Invalid Credentials"}
      }
    }

    if(!(await student.comparePwd((validated as Student).password))){
      return {
        status: 401,
        message: {message: "Invalid Credentials"}
      }
    }

    const token: string = sign(
      {
        id: student.id,
        email: student.email,
        name: student.name,

      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_IN,
      }
    );

    return { status: 200, message: { token }}
  }

  register = async({ validated }: Request): Promise<AssertsShape<any>> => {
    (validated as Student).password = await hash((validated as Student).password, 10);
    const student: Student = await studentRepositorie.save(validated as Student);
    
    return await serializedCreateStudentSchema.validate(student, {
      stripUnknown: true,
    });
  }

  verifyTeacherAproximation = async ({decoded}: Request): Promise<any> => {
    try{

      const teacher: Teacher[] = await teacherRepositorie.all()
  
      const student: Student = await studentRepositorie.findOne({id: decoded.id})
      let studentAddress = await student.address
      
      const result = Promise.all(teacher.map(async(teacher) => {
        if(await teacher.address){

          let teacherAddress = await teacher.address      
          
          return await requestDistanceMaps(studentAddress.cep,  teacherAddress.cep)
        }

      })).then(async (element) => {

        const address = element.sort((a: any, b: any) => a.rows[0].elements[0].distance.value - b.rows[0].elements[0].distance.value)      
        let addressTeacher = Promise.all(address.map(async (el) => {
          
           let cep = el?.destination_addresses[0].split(",")[2].slice(1).replace("-", "")           
           
           let street = await addressRepositorie.findOne({cep: cep})
           

           const distanceValue = el?.rows[0].elements[0].distance.value
           const newStreet = {...street, distanceValue}
           return newStreet
        }))
        
        return await serializedAddressTeacherUtil(await addressTeacher)
      })

      return result

    }catch (error) {
      console.log(error)
    }
      
       

  } 
 


}

export default new StudentService()
