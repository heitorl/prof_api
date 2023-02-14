import { Request, Response } from "express";
import { studentService } from "../servcices";


class StudentController {

  login = async (req: Request, res: Response) => {
    const student = await studentService.login(req)

    return res.status(200).json(student)
  }

  register = async (req: Request, res: Response) => {
    const student = await studentService.register(req)

    return res.status(201).json(student)

  }

  findTeacherAproximation = async (req: Request, res: Response) => {
    const student = await studentService.verifyTeacherAproximation(req)    

    return res.status(200).json(student)
  }

  
}

export default new StudentController()