import { Express } from "express"
import addressRouter from "./address.router";
import studentRouter from "./student.router";
import teacherRouter from "./teacher.router";

const registerRouters = (app: Express): void => {
  app.use('/teacher', teacherRouter );
  app.use('/student', studentRouter )
  app.use('/address', addressRouter );
}

export default registerRouters