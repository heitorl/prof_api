import { Request, Response, Router } from "express";
import multer from "multer";
import teacherController from "../controllers/teacher.controller";
import {
  validateSchema,
  validateToken,
  verifyAccountExists,
} from "../middlewares";
import {
  createCurriculumSchema,
  createTeacherSchema,
  loginSchema,
} from "../schemas";
import { multerConfig } from "../config/multer";

const teacherRouter = Router();

teacherRouter.get("/search", teacherController.findAllTeacher);
teacherRouter.get("/imagem/avatar", teacherController.getAvatarController);
teacherRouter.post(
  "/login",
  validateSchema(loginSchema),
  teacherController.login
);

teacherRouter.post(
  "/register",
  validateSchema(createTeacherSchema),
  verifyAccountExists,
  teacherController.create
);
teacherRouter.patch(
  "/curriculum",
  validateToken,
  validateSchema(createCurriculumSchema),
  teacherController.createCurriculumController
);
teacherRouter.patch(
  "/avatar",
  validateToken,
  multer(multerConfig("teacherAvatar")).single("file"),
  teacherController.updateAvatar
);
teacherRouter.patch(
  "/updatedInfo",
  validateToken,
  teacherController.updatedInfo
);

export default teacherRouter;
