import { Express } from "express";
import addressRouter from "./address.router";
import studentRouter from "./student.router";
import teacherRouter from "./teacher.router";
import teacherController from "../controllers/teacher.controller";
import { validateToken } from "../middlewares";
import notificationRouter from "./notification.route";
import messageRouter from "./message.router";

const registerRouters = (app: Express): void => {
  app.get("/getUser/:id", validateToken, teacherController.getTeacherOrStudent);
  app.use("/teacher", teacherRouter);
  app.use("/student", studentRouter);
  app.use("/address", addressRouter);
  app.use("/notification", notificationRouter);

  app.use("/messages", messageRouter);
};

export default registerRouters;
