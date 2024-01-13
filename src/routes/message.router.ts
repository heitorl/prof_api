import { Router } from "express";
import { validateToken } from "../middlewares";
import { MessageController } from "../controllers";

const messageRouter = Router();

messageRouter.get("/:id", validateToken, MessageController.getRetrieveMessage);

export default messageRouter;
