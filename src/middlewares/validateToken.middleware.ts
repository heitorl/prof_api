import { NextFunction, Request, Response } from "express";
import {JwtPayload, verify, VerifyErrors}  from "jsonwebtoken";
import { Student, Teacher } from "../entities";
import { StudentRepositorie } from "../repositories";
import teacherRepositorie from "../repositories/teacher.repositorie";

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
  ) => {

    const token: string = req.headers.authorization?.split(" ")[1]

    if(!token)
      return res.status(400).json({"message": "Missing authorization token."})

    return verify(
      token,
      process.env.SECRET_KEY,
      (err: VerifyErrors, decoded: string | JwtPayload) => {
        if (err) {
          return res.status(401).json({
            error: { name: "JsonWebTokenError", message: "jwt malformed" },
          });
        }
        const teacher = teacherRepositorie.findOne(
          {email: (decoded as Teacher).email}
        )

        const student = StudentRepositorie.findOne(
          {email: (decoded as Student).email }
        )
        if(teacher){
          req.decoded = decoded as Teacher         
         
          return next()          
        }

        if(student){
          req.decoded = (decoded as Student)

          console.log(decoded, 'student')
          return next()          
        }

      }
    )
}

export default validateToken