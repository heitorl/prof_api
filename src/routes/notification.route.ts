import { Router } from "express";
import { validateToken } from "../middlewares";
import { notificationController } from "../controllers";

const notificationRouter = Router();

notificationRouter.get(
  "",
  validateToken,
  notificationController.getAllNotificationNotRead
);

export default notificationRouter;
