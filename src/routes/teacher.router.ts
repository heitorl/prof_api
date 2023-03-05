import { Request, Response, Router } from "express";
import multer from "multer";
import teacherController from "../controllers/teacher.controller";
import { validateSchema, validateToken, verifyAccountExists } from "../middlewares";
import { createTeacherSchema, loginSchema } from "../schemas";
import {multerConfig} from "../config/multer"


const teacherRouter = Router()


teacherRouter.post("/login", validateSchema(loginSchema), teacherController.login)
teacherRouter.post("/register", validateSchema(createTeacherSchema), verifyAccountExists, teacherController.create)

teacherRouter.patch("/avatar", validateToken, multer(multerConfig('teacherAvatar')).single('file'), teacherController.updateAvatar)



export default teacherRouter


// (request: Request, response: Response) => {
//   console.log(request.file)
//   response.status(200).json({"message": "image as uploaded."})
// })