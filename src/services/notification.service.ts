import { Request } from "express";
import { AppDataSource } from "../data-source";
import { Student, Teacher } from "../entities";
import { Notification } from "../entities/Notification";
import studentRepositorie from "../repositories/student.repositorie";
import teacherRepositorie from "../repositories/teacher.repositorie";

interface FormattedNotification {
  id: string;
  content: string;
  read: boolean;
  createdAt: Date;
  senderStudent?: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    avatar?: string | null;
  };
  senderTeacher?: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    avatar?: string | null;
  };
}

class NotificationService {
  createNotification = async (
    content: string,
    to: string,
    from: string
  ): Promise<void> => {
    // Encontra o remetente
    const sender =
      (await AppDataSource.getRepository(Student).findOne({
        where: { id: from },
      })) ||
      (await AppDataSource.getRepository(Teacher).findOne({
        where: { id: from },
      }));

    // Encontra o destinatário
    const receiver =
      (await AppDataSource.getRepository(Student).findOne({
        where: { id: to },
      })) ||
      (await AppDataSource.getRepository(Teacher).findOne({
        where: { id: to },
      }));

    // Cria uma nova notificação
    const notification = new Notification();
    notification.content = content;

    // Define o remetente e destinatário na notificação
    if (sender instanceof Student) {
      notification.senderStudent = sender;
    } else if (sender instanceof Teacher) {
      notification.senderTeacher = sender;
    }

    if (receiver instanceof Student) {
      notification.receiverStudent = receiver;
    } else if (receiver instanceof Teacher) {
      notification.receiverTeacher = receiver;
    }

    await AppDataSource.getRepository(Notification).save(notification);
  };

  getAllNotificationNotRead = async ({ decoded }: Request) => {
    const notificationRepository = await AppDataSource.getRepository(
      Notification
    );
    const notifications = await notificationRepository.find({
      where: [
        { receiverStudent: { id: decoded.id }, read: false },
        { receiverTeacher: { id: decoded.id }, read: false },
      ],
    });

    return this.formatNotifications(notifications);
  };

  formatNotifications = (
    notifications: Notification[]
  ): FormattedNotification[] => {
    return notifications.map((notification) => {
      const formattedNotification: FormattedNotification = {
        id: notification.id,
        content: notification.content,
        read: notification.read,
        createdAt: notification.createdAt,
        senderStudent: notification.senderStudent
          ? {
              id: notification.senderStudent.id,
              name: notification.senderStudent.name,
              lastName: notification.senderStudent.lastName,
              email: notification.senderStudent.email,
              avatar: notification.senderStudent.avatar,
            }
          : null,
        senderTeacher: notification.senderTeacher
          ? {
              id: notification.senderTeacher.id,
              name: notification.senderTeacher.name,
              lastName: notification.senderTeacher.lastName,
              email: notification.senderTeacher.email,
              avatar: notification.senderTeacher.avatar,
            }
          : null,
      };
      return formattedNotification;
    });
  };

  // getAllNotificationNotRead = async ({
  //   decoded,
  // }: Request): Promise<Notification[]> => {
  //   const notificationRepository: Notification[] = await AppDataSource.getRepository(
  //     Notification
  //   )
  //   const notifications = await notificationRepository.find({
  //     where: [
  //       { senderStudentId: decoded.id },
  //       { senderTeacherId: decoded.id },
  //       { receiverStudentId: decoded.id },
  //       { receiverTeacherId: decoded.id },
  //     ],
  //   });

  //   return notifications;
  // };
}

export default new NotificationService();
