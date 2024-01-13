import { Request, Response } from "express";
import messageService from "../services/message.service";

class Message {
  getRetrieveMessage = async (req: Request, res: Response) => {
    const messages = await messageService.retrieveMessage(req);

    return res.status(200).json(messages);
  };
}

export default new Message();
