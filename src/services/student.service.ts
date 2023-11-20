import { sign } from "jsonwebtoken";
import { Request } from "express";
import * as env from "dotenv";
import { AssertsShape } from "yup/lib/object";
import { hash } from "bcrypt";
import { Student, Teacher } from "../entities";
import { assessmentRepositorie, StudentRepositorie } from "../repositories";
import studentRepositorie from "../repositories/student.repositorie";
import { serializedCreateStudentSchema } from "../schemas";
import teacherRepositorie from "../repositories/teacher.repositorie";
import { requestDistanceMaps } from "../requests";

import { deleteFile } from "../utils/file";

env.config();

interface iStudentLogin {
  status: number;
  message: object;
}

class StudentService {
  login = async ({ validated }: Request): Promise<iStudentLogin> => {
    const student: Student = await StudentRepositorie.findOne({
      email: (validated as Student).email,
    });

    if (!student) {
      return {
        status: 401,
        message: { message: "Invalid Credentials" },
      };
    }

    if (!(await student.comparePwd((validated as Student).password))) {
      return {
        status: 401,
        message: { message: "Invalid Credentials" },
      };
    }

    const token: string = sign(
      {
        id: student.id,
        email: student.email,
        name: student.name,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_IN,
      }
    );

    return { status: 200, message: { token } };
  };

  register = async ({ validated }: Request): Promise<AssertsShape<any>> => {
    (validated as Student).password = await hash(
      (validated as Student).password,
      10
    );
    const student: Student = await studentRepositorie.save(
      validated as Student
    );

    return await serializedCreateStudentSchema.validate(student, {
      stripUnknown: true,
    });
  };

  verifyTeacherAproximation = async ({
    decoded,
    query,
  }: Request): Promise<any> => {
    try {
      const teachers: Teacher[] = await teacherRepositorie.all();
      const student: Student = await studentRepositorie.findOne({
        id: decoded.id,
      });
      const teacher: Teacher = await teacherRepositorie.findOne({
        id: decoded.id,
      });

      const user = student ? student : teacher;

      let userAddress = user.address;

      const result = await Promise.all(
        teachers.map(async (teacher) => {
          if (await teacher.address) {
            let teacherAddress = await teacher.address;
            const distanceData = await requestDistanceMaps(
              userAddress.cep,
              teacherAddress.cep
            );

            return {
              teacher: teacher,
              distanceData: distanceData,
            };
          } else {
            return { teacher, distanceData: null };
          }
        })
      ).then(async (elements) => {
        const address = elements.sort(
          (a: any, b: any) =>
            (a.distanceData?.rows[0]?.elements[0]?.distance?.value || 0) -
            (b.distanceData?.rows[0]?.elements[0]?.distance?.value || 0)
        );

        let addressTeacher = await Promise.all(
          address.map(async (el) => {
            const status = el.distanceData?.status;
            if (status === "OK") {
              const distanceValue =
                el.distanceData.rows[0].elements[0].distance.value;

              const distanceInKilometers = Math.round(distanceValue / 1000);

              return { ...el.teacher, distanceInKilometers };
            } else {
              // console.error(
              //   `Error fetching distance data for teacher ${el.teacher.id}: ${status}`
              // );
              return { ...el.teacher, distanceInKilometers: null };
            }
          })
        );
        if (query.disciplina) {
          const disciplinas =
            typeof query.disciplina === "string"
              ? [query.disciplina]
              : Array.isArray(query.disciplina)
              ? query.disciplina
              : [];

          addressTeacher = addressTeacher.filter((teacher) =>
            teacher.disciplines.some((discipline) =>
              disciplinas.some((d) => discipline.disciplines.includes(d))
            )
          );
        }

        return addressTeacher;
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  updateStudentAvatar = async (
    { decoded }: Request,
    avatarFile: string
  ): Promise<void> => {
    const student: Student = await studentRepositorie.findOne({
      id: (decoded as Teacher).id,
    });
    if (student.avatar)
      await deleteFile(`./src/tmp/studentAvatar/${student.avatar}`);

    student.avatar = avatarFile;

    await teacherRepositorie.save(student);
  };

  updateGradesToTeacher = async (req: Request) => {
    try {
      const student: Student = await studentRepositorie.findOne({
        id: (req.decoded as Student).id,
      });
      const teacher: Teacher = await teacherRepositorie.findOne({
        id: req.query.id,
      });

      // const saved = await assessmentRepositorie.save({
      //   detail: req.body.detail,
      //   note: req.body.note,
      //   student: student,
      //   teacher: teacher
      // })

      const assessment = await assessmentRepositorie.findOne({});

      return "";
    } catch (error) {
      console.log(error);
    }
  };
}

export default new StudentService();
