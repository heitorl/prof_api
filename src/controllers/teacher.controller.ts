import { Request, Response } from "express";
import { resolve } from "path";
import { Teacher } from "../entities";
import { teacherService } from "../services";

class TeacherController {
  login = async (req: Request, res: Response) => {
    const teacher = await teacherService.login(req);

    return res.status(200).json(teacher);
  };

  create = async (req: Request, res: Response) => {
    const teacher = await teacherService.register(req);

    return res.status(201).json(teacher);
  };

  updateAvatar = async (req: Request, res: Response) => {
    // const avatarFile = req.file.fileName
    const avatarFile = req.file.filename;
    const updateAvatar = await teacherService.updateTeacherAvatar(
      req,
      avatarFile
    );

    res.sendFile(updateAvatar);
  };

  getAvatarController = async (req: Request, res: Response) => {
    try {
      const avatarPath = await teacherService.getAvatarById(req);
      res.sendFile(avatarPath);
    } catch (error) {
      console.error(`Error sending avatar: ${error}`);
      res.status(500).send("Error sending avatar");
    }
  };

  findAllTeacher = async (_: null, res: Response) => {
    const teacher = await teacherService.findAll();

    return res.status(200).json(teacher);
  };

  updatedInfo = async (req: Request, res: Response) => {
    try {
      const update = await teacherService.updatedInfo(req);
      res.status(200).json(update);
    } catch (err) {
      console.log(err.message);
      res.status(403).json({ message: err.message });
    }
  };

  createCurriculumController = async (req: Request, res: Response) => {
    const newCurriculum = await teacherService.createCurriculum(req);

    return res.status(200).json(newCurriculum);
  };
}

export default new TeacherController();
