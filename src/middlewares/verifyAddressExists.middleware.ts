import { NextFunction, Request, Response } from "express";
import { Student, Teacher } from "../entities";
import { StudentRepositorie, TeacherRepositorie } from "../repositories";

const verifyAddressAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const teacher: Teacher = await TeacherRepositorie.findOne({
    email: (req.decoded as Teacher).email,
  })
  const student: Student = await StudentRepositorie.findOne({
    email: (req.decoded as Teacher).email,
  })  
  
  if (await teacher?.address) 
    return res.status(409).json({"message": "User already has a address."});
  
  if (await student?.address) 
    return res.status(409).json({"message": "User already has a address."});
    

  next();
};

export default verifyAddressAlreadyExists;