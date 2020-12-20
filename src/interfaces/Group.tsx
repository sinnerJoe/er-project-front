import { IdIndex } from "shared/interfaces/Id";
import { Student, Teacher, User } from "shared/interfaces/User";
import { Plan } from "./Plan";

export interface CollegeGroup {
    id: IdIndex,
    name: string,
    year: IdIndex,
    coordinator?: Teacher,
    students?: Student[]
    plan?: Plan
}