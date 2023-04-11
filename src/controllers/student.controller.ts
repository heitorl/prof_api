import { Request, Response } from "express";
import { Student } from "../entities";
import { studentService } from "../services";


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

  updateAvatar = async (req: Request, res: Response): Promise<Response> => {
    // const avatarFile = req.file.fileName
    const avatarFile = req.file.filename
    
    if(!avatarFile)
      return res.status(400).json({message: "Problema no upload de arquivo."})
    console.log(req.file)
    const updateAvatar = await studentService.updateStudentAvatar(req, avatarFile)

    return res.status(200).json(updateAvatar)
  }

  updateGradeTeacher = async (req: Request, res: Response) => {

    const teacherAvailable = studentService.updateGradesToTeacher(req)

    return res.status(200).json(teacherAvailable)

  }

  
}

export default new StudentController()