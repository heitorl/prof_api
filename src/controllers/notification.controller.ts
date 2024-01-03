import { Request, Response } from "express";
import notificationService from "../services/notification.service";

class NotificationController {
  getAllNotificationNotRead = async (req: Request, res: Response) => {
    try {
      const notifications = await notificationService.getAllNotificationNotRead(
        req
      );

      return res.status(200).json(notifications);
    } catch (err) {
      console.log(err);
    }
  };
}

export default new NotificationController();
