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

    console.log("notify ---- 1");

    if (teacherSender) {
      sender = teacherSender;
      console.log("notify ---- 2");

      receiver =
        (await AppDataSource.getRepository(Student).findOne({
          where: { id: to },
        })) ??
        (await AppDataSource.getRepository(Teacher).findOne({
          where: { id: to },
        }));
    } else {
      console.log("notify ---- 3");
      const studentSender = await AppDataSource.getRepository(Student).findOne({
        where: { id: from },
      });
      sender = studentSender;
      // Encontra o Teacher receptor
      receiver = await AppDataSource.getRepository(Teacher).findOne({
        where: { id: to },
      });
    }

    if (sender && receiver) {
      const newMessage = new Message();

      console.log("notify ---- 4");
      newMessage.content = content;
      newMessage.senderStudent = sender instanceof Student ? sender : null;
      newMessage.senderTeacher = sender instanceof Teacher ? sender : null;
      newMessage.receiverStudent =
        receiver instanceof Student ? receiver : null;
      newMessage.receiverTeacher =
        receiver instanceof Teacher ? receiver : null;

      console.log("notify ---- 5");
      await AppDataSource.getRepository(Message).save(newMessage);
      console.log("notify ---- 6");
      await notificationService.createNotification(content, to, from);

      console.log("Messagem salva com susseco!");
    }
  };
}

export default new MessageService();
