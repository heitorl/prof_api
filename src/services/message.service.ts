import { Request } from "express";
import { AppDataSource } from "../data-source";
import { Student, Teacher } from "../entities";
import { Message } from "../entities/Message";
import notificationService from "./notification.service";

class MessageService {
  createMessage = async (
    content: string,
    to: string,
    from: string
  ): Promise<void> => {
    let sender: Teacher | Student;
    let receiver: Teacher | Student;

    const teacherSender = await AppDataSource.getRepository(Teacher).findOne({
      where: { id: from },
    });

    if (teacherSender) {
      sender = teacherSender;

      receiver =
        (await AppDataSource.getRepository(Student).findOne({
          where: { id: to },
        })) ??
        (await AppDataSource.getRepository(Teacher).findOne({
          where: { id: to },
        }));
    } else {
      const studentSender = await AppDataSource.getRepository(Student).findOne({
        where: { id: from },
      });
      sender = studentSender;
      receiver = await AppDataSource.getRepository(Teacher).findOne({
        where: { id: to },
      });
    }

    if (sender && receiver) {
      const newMessage = new Message();

      newMessage.content = content;
      newMessage.senderStudent = sender instanceof Student ? sender : null;
      newMessage.senderTeacher = sender instanceof Teacher ? sender : null;
      newMessage.receiverStudent =
        receiver instanceof Student ? receiver : null;
      newMessage.receiverTeacher =
        receiver instanceof Teacher ? receiver : null;

      await AppDataSource.getRepository(Message).save(newMessage);
      await notificationService.createNotification(content, to, from);

      console.log("Messagem salva com susseco!");
    }
  };

  retrieveMessage = async ({ decoded, params }: Request) => {
    const messages = await AppDataSource.getRepository(Message).find({
      where: [
        {
          senderTeacher: { id: decoded.id },
          receiverTeacher: { id: params.id },
        },
        {
          senderTeacher: { id: params.id },
          receiverTeacher: { id: decoded.id },
        },
        {
          senderStudent: { id: decoded.id },
          receiverTeacher: { id: params.id },
        },
        {
          senderTeacher: { id: params.id },
          receiverStudent: { id: decoded.id },
        },
      ],
      order: {
        createdAt: "ASC",
      },
    });

    return messages.map((message) => {
      const sender = message.senderTeacher
        ? { id: message.senderTeacher.id, name: message.senderTeacher.name }
        : { id: message.senderStudent.id, name: message.senderStudent.name };

      const receiver = message.receiverTeacher
        ? { id: message.receiverTeacher.id, name: message.receiverTeacher.name }
        : {
            id: message.receiverStudent.id,
            name: message.receiverStudent.name,
          };

      return {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        sender,
        receiver,
      };
    });
  };
}

export default new MessageService();
