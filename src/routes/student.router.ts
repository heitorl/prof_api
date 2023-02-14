import { Router } from "express";
import { studentController } from "../controllers";
import { validateSchema, validateToken, verifyAccountExists } from "../middlewares";
import { createStudentSchema, loginSchema } from "../schemas";

const studentRouter = Router()

studentRouter.post("/login", validateSchema(loginSchema), studentController.login)
studentRouter.post("/register", validateSchema(createStudentSchema), verifyAccountExists, studentController.register)
studentRouter.get("/register", validateSchema(createStudentSchema), verifyAccountExists, studentController.register)
studentRouter.get("/search",validateToken, studentController.findTeacherAproximation)


export default studentRouter