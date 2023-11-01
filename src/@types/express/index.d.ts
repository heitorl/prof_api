import { Address, Curriculum, Discipline, Student, Teacher } from "../../entities";

declare global {
  namespace Express {
    interface Request {
      validated?: Teacher | Student | Address | Discipline | Curriculum
      decoded?: Teacher | Student      
    }
  }
}