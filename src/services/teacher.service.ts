import { sign } from "jsonwebtoken";
import { Request } from "express";
import { Curriculum, Discipline, Teacher } from "../entities";
import teacherRepositorie from "../repositories/teacher.repositorie";
import * as env from "dotenv";
import { AssertsShape } from "yup/lib/object";
import { hash } from "bcrypt";
import {
  serializedCreateCurriculumSchema,
  serializedCreateTeacherSchema,
} from "../schemas";
import { deleteFile } from "../utils/file";
import { returnUserWithOutPassword } from "../utils/serializedAddresTeacher.util";
import { AppDataSource } from "../data-source";
import path from "path";
import { existsSync } from "fs";

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

  updateTeacherAvatar = async (
    { decoded }: Request,
    avatarFile: string
  ): Promise<string> => {
    try {
      const teacher: Teacher = await teacherRepositorie.findOne({
        id: (decoded as Teacher).id,
      });

      if (teacher.avatar) {
        await deleteFile(`./src/tmp/teacherAvatar/${teacher.avatar}`);
      }

      teacher.avatar = avatarFile;

      const source = path.join(
        __dirname,
        "..",
        "..",
        "src",
        "tmp",
        "teacherAvatar"
      );
      await teacherRepositorie.save(teacher);

      let avatarPath = `${source}/${teacher.avatar}`;

      return avatarPath;
    } catch (error) {
      console.error("Error updating teacher avatar:", error);
      throw new Error("Failed to update teacher avatar");
    }
  };

  getAvatarById = async ({ query }: Request): Promise<string> => {
    try {
      const teacher: Teacher = await teacherRepositorie.findOne({
        id: query.id,
      });
      if (!teacher || !teacher.avatar) {
        throw new Error("Avatar not found");
      }
      const source = path.resolve(
        __dirname,
        "..",
        "..",
        "src",
        "tmp",
        "teacherAvatar"
      );
      let avatarPath = `${source}/${teacher.avatar}`;
      if (!existsSync(avatarPath)) {
        throw new Error("Avatar not found on disk");
      }
      return avatarPath;
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
