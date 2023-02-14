import { Request, Response } from "express";
import { teacherService } from "../servcices";


class TeacherController {

  login = async (req: Request, res: Response) => {
    const teacher = await teacherService.login(req)

    return res.status(200).json(teacher)

  }

  create = async (req: Request, res: Response) => {
    const teacher = await teacherService.register(req)
    
    return res.status(201).json(teacher)
  }

}

export default new TeacherController()
