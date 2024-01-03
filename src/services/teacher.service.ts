import { sign } from "jsonwebtoken";
import { Request } from "express";
import { Curriculum, Discipline, Student, Teacher } from "../entities";
import teacherRepositorie from "../repositories/teacher.repositorie";
import * as env from "dotenv";
import { AssertsShape } from "yup/lib/object";
import { hash } from "bcrypt";
import { serializedCreateTeacherSchema } from "../schemas";
import { deleteFile } from "../utils/file";
import { returnUserWithOutPassword } from "../utils/serializedAddresTeacher.util";
import { AppDataSource } from "../data-source";
import path from "path";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { existsSync } from "fs";
import studentRepositorie from "../repositories/student.repositorie";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

env.config();

interface iTeacherLogin {
  status: number;
  message: object;
}

class TeacherService {
  login = async ({ validated }: Request): Promise<iTeacherLogin> => {
    const teacher: Teacher = await teacherRepositorie.findOne({
      email: (validated as Teacher).email,
    });

    if (!teacher) {
      return {
        status: 401,
        message: { message: "Invalid Credentials" },
      };
    }

    if (!(await teacher.comparePwd((validated as Teacher).password))) {
      return {
        status: 401,
        message: { message: "Invalid Credentials" },
      };
    }

    const token: string = sign(
      {
        id: teacher.id,
        email: teacher.email,
        name: teacher.name,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_IN,
      }
    );

    const user = returnUserWithOutPassword({ ...teacher });

    return { status: 200, message: { user, token } };
  };

  register = async ({ validated }: Request): Promise<AssertsShape<any>> => {
    (validated as Teacher).password = await hash(
      (validated as Teacher).password,
      10
    );
    const teacher: Teacher = await teacherRepositorie.save(
      validated as Teacher
    );

    return await serializedCreateTeacherSchema.validate(teacher, {
      stripUnknown: true,
    });
  };

  getTeacherOrStudent = async ({ params, decoded }: Request) => {
    const id = params.id;
    try {
      const student: Student | null = await studentRepositorie.findOne({ id });
      const teacher: Teacher | null = await teacherRepositorie.findOne({ id });

      let role: "student" | "teacher" | null;

      student ? (role = "student") : (role = "teacher");

      const userWithRole = {
        ...(student || teacher),
        role,
      };

      return userWithRole;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  };

  updateTeacherAvatar = async (
    { decoded }: Request,
    avatarFile: Express.Multer.File
  ): Promise<string> => {
    const BUCKET = process.env.BUCKET;
    const folder = "avatar_prof";
    const region = process.env.REGION;

    console.log("AWS_ACCESS_KEY_ID:", process.env.ACCESS_KEY);
    console.log("AWS_SECRET_ACCESS_KEY:", process.env.ACCESS_SECRET_KEY);

    const s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.ACCESS_SECRET_KEY,
      },
    });

    try {
      const teacher: Teacher = await teacherRepositorie.findOne({
        id: (decoded as Teacher).id,
      });

      const avatarFileName = `${uuidv4()}_${path.basename(
        avatarFile.originalname
      )}`;

      teacher.avatar = avatarFileName;

      console.log(teacher.avatar);

      const params = {
        Bucket: BUCKET,
        Key: `${folder}/${avatarFileName}`,
        Body: avatarFile.buffer,
      };

      // Use async/await for the command execution
      await s3Client.send(new PutObjectCommand(params));

      teacher.avatar = avatarFileName;
      await teacherRepositorie.save(teacher);

      const avatarUrl = `https://${BUCKET}.s3-${region}.amazonaws.com/${folder}/${avatarFileName}`;
      return avatarUrl;
    } catch (error) {
      console.error("Error updating teacher avatar:", error);
      throw new Error("Failed to update teacher avatar");
    }
  };

  getAvatarById = async ({ query }: Request): Promise<string> => {
    try {
      const undefinedFile =
        "06c87ec4-9fea-4c38-b267-d69e1d376d79-undefined.png";
      const teacher: Teacher = await teacherRepositorie.findOne({
        id: query.id,
      });

      const fileName = teacher.avatar;

      if (!fileName) {
        return `https://${process.env.BUCKET}.s3.${process.env.REGION}.amazonaws.com/avatars/${undefinedFile}`;
      }

      const avatarUrl = `https://${process.env.BUCKET}.s3.${process.env.REGION}.amazonaws.com/avatars/${fileName}`;
      return avatarUrl;
    } catch (error) {
      console.error(`Error fetching avatar: ${error}`);
      throw new Error("Error fetching avatar");
    }
  };

  findAll = async (): Promise<Teacher[]> => {
    const teacher: Teacher[] = await teacherRepositorie.all();

    return teacher;
  };

  updatedInfo = async ({ body, decoded }: Request) => {
    const teacher = await teacherRepositorie.findOne({
      id: decoded.id,
    });

    const disciplineRepository = AppDataSource.getRepository(Discipline);
    const curriculumRepository = AppDataSource.getRepository(Curriculum);

    const curriculumToUpdate = await curriculumRepository.findOne({
      where: { teacher: { id: decoded.id } },
    });

    if (teacher) {
      const { name, email, lastName } = body;
      const user = {
        name: name || teacher.name,
        lastName: lastName || teacher.lastName,
        email: email || teacher.email,
      };

      await AppDataSource.getRepository(Teacher).update(teacher.id, {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
      });

      if (body.phone) {
        await curriculumRepository.update(curriculumToUpdate.id, {
          celullar: body.phone,
          teacher,
        });
      }

      if (body.selectedDisciplines.length > 0) {
        const disciplinesArray = Array.isArray(body.selectedDisciplines)
          ? body.selectedDisciplines
          : [body.selectedDisciplines];

        if (!teacher.disciplines[0]?.disciplines) {
          // Se for undefined, inicializa um objeto Discipline com um array vazio.
          teacher.disciplines[0] = disciplineRepository.create({
            disciplines: [],
            teacher,
          });
        }

        const remainingDisciplines =
          3 - (teacher.disciplines[0]?.disciplines?.length || 0);

        if (remainingDisciplines > 0) {
          const disciplinesToAdd = disciplinesArray.slice(
            0,
            remainingDisciplines
          );

          teacher.disciplines[0].disciplines = [
            ...teacher.disciplines[0].disciplines,
            ...disciplinesToAdd,
          ];

          await disciplineRepository.save(teacher.disciplines[0]);

          return teacher;
        } else {
          throw new Error("O professor já possui 3 disciplinas.");
        }
      }
    } else {
      console.log("Professor não encontrado.");
    }
  };

  //TASK-REFATORE
  createCurriculum = async ({ validated, decoded }: Request) => {
    try {
      const teacher = await teacherRepositorie.findOne({
        id: decoded.id,
      });

      const curriculumRepository = AppDataSource.getRepository(Curriculum);

      const curriculumToUpdate = await curriculumRepository.findOne({
        where: { teacher: { id: decoded.id } },
      });

      if (curriculumToUpdate) {
        await curriculumRepository.update(curriculumToUpdate.id, {
          formation: (validated as Curriculum).formation,
          professional_experience: (validated as Curriculum)
            .professional_experience,
          celullar: (validated as Curriculum).celullar,
          resume: (validated as Curriculum).resume,
          teacher,
        });

        return curriculumToUpdate;
      } else {
        const newCurriculum = await curriculumRepository.create({
          formation: (validated as Curriculum).formation,
          professional_experience: (validated as Curriculum)
            .professional_experience,
          celullar: (validated as Curriculum).celullar,
          resume: (validated as Curriculum).resume,
          teacher,
        });

        const createdCurriculum = await curriculumRepository.save(
          newCurriculum
        );
        return createdCurriculum;
      }
    } catch (error) {
      console.error(error);
    }
  };
}

export default new TeacherService();
