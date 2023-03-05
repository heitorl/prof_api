import { Request, Response } from "express";
import { teacherService } from "../services";


class TeacherController {

  login = async (req: Request, res: Response) => {
    const teacher = await teacherService.login(req)

    return res.status(200).json(teacher)

  }

  create = async (req: Request, res: Response) => {
    const teacher = await teacherService.register(req)
    
    return res.status(201).json(teacher)
  }

  updateAvatar = async (req: Request, res: Response): Promise<Response> => {
      // const avatarFile = req.file.fileName
      const avatarFile = req.file.filename
      console.log(req.file)
      const updateAvatar = await teacherService.updateTeacherAvatar(req, avatarFile)
  
      return res.status(200).json(updateAvatar)
  }

}

export default new TeacherController()
