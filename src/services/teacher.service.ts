import { sign } from "jsonwebtoken";
import { Request } from "express";
import { Curriculum, Discipline, Student, Teacher } from "../entities";
import teacherRepositorie from "../repositories/teacher.repositorie";
import * as env from "dotenv";
import { AssertsShape } from "yup/lib/object";
import { hash } from "bcrypt";
import { serializedCreateTeacherSchema } from "../schemas";
import { returnUserWithOutPassword } from "../utils/serializedAddresTeacher.util";
import { AppDataSource } from "../data-source";
import path from "path";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import studentRepositorie from "../repositories/student.repositorie";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

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
    const MAX_SIZE_KB = 25;

    const s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.ACCESS_SECRET_KEY,
      },
    });

    try {
      const user: Teacher | Student =
        (await teacherRepositorie.findOne({
          id: (decoded as Teacher).id,
        })) ||
        (await studentRepositorie.findOne({
          id: (decoded as Student).id,
        }));

      console.log("user é um professor ? ", this.isTeacher(user));

      if (user.avatar) {
        const deleteParams = {
          Bucket: BUCKET,
          Key: `${folder}/${user.avatar}`,
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
      }

      const avatarFileName = `${uuidv4()}_${path.basename(
        avatarFile.originalname
      )}`;

      const compressedImageBuffer = await this.compressImage(
        avatarFile.buffer,
        MAX_SIZE_KB
      );

      user.avatar = avatarFileName;

      const params = {
        Bucket: BUCKET,
        Key: `${folder}/${avatarFileName}`,
        Body: compressedImageBuffer,
      };

      await s3Client.send(new PutObjectCommand(params));

      user.avatar = avatarFileName;

      if (this.isTeacher(user)) {
        await teacherRepositorie.save(user);
      } else {
        await studentRepositorie.save(user);
      }

      const avatarUrl = `https://${BUCKET}.s3-${region}.amazonaws.com/${folder}/${avatarFileName}`;
      return avatarUrl;
    } catch (error) {
      console.error("Error updating teacher avatar:", error);
      throw new Error("Failed to update teacher avatar");
    }
  };

  compressImage = async (
    imageBuffer: Buffer,
    maxSizeKB: number
  ): Promise<Buffer> => {
    let compressedBuffer = imageBuffer;
    const originalSizeKB = imageBuffer.length / 1024;

    // Redimensionar se necessário
    const { width, height } = await sharp(imageBuffer).metadata();
    if (width > 500 || height > 350) {
      compressedBuffer = await sharp(imageBuffer)
        .resize(400, 350, { fit: "inside" })
        .toBuffer();
    }

    // Ajustar qualidade da compressão
    const qualityStep = 5; // Ajuste conforme necessário
    let currentQuality = 80; // Valor inicial
    while (
      compressedBuffer.length > maxSizeKB * 1024 &&
      currentQuality >= qualityStep
    ) {
      compressedBuffer = await sharp(compressedBuffer)
        .jpeg({ quality: currentQuality, progressive: true })
        .toBuffer();

      currentQuality -= qualityStep;
    }

    console.log("Original Size:", originalSizeKB, "KB");
    console.log("Final Size:", compressedBuffer.length / 1024, "KB");

    return compressedBuffer;
  };

  getAvatarById = async ({ query }: Request): Promise<string> => {
    try {
      const undefinedFile =
        "75dc786f-d4cc-42a6-b108-86e475fd9594_undefined.png";

      const user: Teacher | Student =
        (await teacherRepositorie.findOne({
          id: query.id,
        })) ||
        (await studentRepositorie.findOne({
          id: query.id,
        }));

      const fileName = user.avatar;

      if (!fileName) {
        return `https://${process.env.BUCKET}.s3.${process.env.REGION}.amazonaws.com/avatar_prof/${undefinedFile}`;
      }

      const avatarUrl = `https://${process.env.BUCKET}.s3.${process.env.REGION}.amazonaws.com/avatar_prof/${fileName}`;
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

  isTeacher = (user: Teacher | Student): user is Teacher => {
    return (
      (user as Teacher).disciplines !== undefined ||
      (user as Teacher).disciplines !== null
    );
  };
}

export default new TeacherService();
