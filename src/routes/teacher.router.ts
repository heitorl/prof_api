import { Router } from "express";
import teacherController from "../controllers/teacher.controller";
import { validateSchema, verifyAccountExists } from "../middlewares";
import { createTeacherSchema, loginSchema } from "../schemas";

const teacherRouter = Router()

teacherRouter.post("/login", validateSchema(loginSchema), teacherController.login)
teacherRouter.post("/register", validateSchema(createTeacherSchema), verifyAccountExists, teacherController.create)


export default teacherRouter