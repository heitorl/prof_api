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
import fs from "fs/promises";

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
  ): Promise<void> => {
    const teacher: Teacher = await teacherRepositorie.findOne({
      id: (decoded as Teacher).id,
    });
    if (teacher.avatar)
      await deleteFile(`./src/tmp/teacherAvatar/${teacher.avatar}`);

    teacher.avatar = avatarFile;

    await teacherRepositorie.save(teacher);
  };

  getAvatarById = async ({ query }: Request): Promise<string> => {
    console.log(query.id);
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

      if (body.celullar) {
        await curriculumRepository.update(curriculumToUpdate.id, {
          celullar: body.celullar,
          teacher,
        });
      }

      if (body.disciplines) {
        const disciplinesArray = Array.isArray(body.disciplines)
          ? body.disciplines
          : [body.disciplines];

        if (teacher.disciplines[0].disciplines.length < 3) {
          const remainingDisciplines =
            3 - teacher.disciplines[0].disciplines.length;

          for (
            let i = 0;
            i < Math.min(remainingDisciplines, disciplinesArray.length);
            i++
          ) {
            teacher.disciplines[0].disciplines.push(disciplinesArray[i]);
          }
          await disciplineRepository.update(teacher.disciplines[0].id, {
            disciplines: teacher.disciplines[0].disciplines,
            teacher,
          });

          return ("Dados salvos com sucesso.");
        } else {
          throw new Error("O professor já possui 3 disciplinas.");
        }
      }
    } else {
      console.log("Professor não encontrado.");
    }
  };

  // console.log(updatedDiscipline);
  //TASK-REFATORE
  createCurriculum = async ({ validated, decoded }: Request) => {
    try {
      let result;
      const teacher = await teacherRepositorie.findOne({
        id: decoded.id,
      });

      const disciplineRepository = AppDataSource.getRepository(Discipline);
      const curriculumRepository = AppDataSource.getRepository(Curriculum);

      const curriculumToUpdate = await curriculumRepository.findOne({
        where: { cpf: (validated as Curriculum).cpf },
      });

      if (curriculumToUpdate) {
        console.log((validated as Curriculum).resume);
        const updatedDiscipline = await disciplineRepository.update(
          teacher.disciplines[0].id,
          {
            disciplines: (validated as Discipline).disciplines,
            teacher,
          }
        );

        const updatedCurriculum = await curriculumRepository.update(
          curriculumToUpdate.id,
          {
            cpf: (validated as Curriculum).cpf,
            formation: (validated as Curriculum).formation,
            skills: (validated as Curriculum).skills,
            professional_experience: (validated as Curriculum)
              .professional_experience,
            linkedin: (validated as Curriculum).linkedin,
            celullar: (validated as Curriculum).celullar,
            resume: (validated as Curriculum).resume,
            teacher,
          }
        );

        result = { ...updatedCurriculum, ...updatedDiscipline };
      } else {
        const newDiscipline = disciplineRepository.create({
          disciplines: (validated as Discipline).disciplines,
          teacher,
        });
        const newCurriculum = curriculumRepository.create({
          cpf: (validated as Curriculum).cpf,
          formation: (validated as Curriculum).formation,
          skills: (validated as Curriculum).skills,
          professional_experience: (validated as Curriculum)
            .professional_experience,
          linkedin: (validated as Curriculum).linkedin,
          celullar: (validated as Curriculum).celullar,
          resume: (validated as Curriculum).resume,
          teacher,
        });
        await disciplineRepository.save(newDiscipline);
        await curriculumRepository.save(newCurriculum);

        result = await serializedCreateCurriculumSchema.validate(
          { ...newCurriculum, ...newDiscipline },
          {
            stripUnknown: true,
          }
        );
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  };
}

export default new TeacherService();
