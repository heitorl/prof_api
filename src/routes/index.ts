import { Express } from "express";
import addressRouter from "./address.router";
import studentRouter from "./student.router";
import teacherRouter from "./teacher.router";
import teacherController from "../controllers/teacher.controller";
import { validateToken } from "../middlewares";

const registerRouters = (app: Express): void => {
  app.get("/getUser/:id", validateToken, teacherController.getTeacherOrStudent);
  app.use("/teacher", teacherRouter);
  app.use("/student", studentRouter);
  app.use("/address", addressRouter);
};

export default registerRouters;
