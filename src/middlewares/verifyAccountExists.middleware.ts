import { NextFunction, Request, Response } from "express";
import { Student, Teacher } from "../entities";
import { StudentRepositorie, TeacherRepositorie } from "../repositories";


const verifyAccountExists = async (req: Request, res: Response, next: NextFunction) => {

  const foundTeacher: Teacher = await TeacherRepositorie.findOne({ email: req.body.email })

  const foundStudent: Student = await StudentRepositorie.findOne({ email: req.body.email })

  if(foundTeacher || foundStudent){
    return res.status(409).json({message: "Email already exists."})
  }

  return next()

}

export default verifyAccountExists