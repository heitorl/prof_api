import { Address, Student, Teacher } from "../../entities";

declare global {
  namespace Express {
    interface Request {
      validated?: Teacher | Student | Address
      decoded?: Teacher | Student      
    }
  }
}