import { Moment } from "moment";
import { EvaluatedStudent, Teacher } from "shared/interfaces/User";
import { ServerSolution, Solution } from "./Solution";

export type AssignmentModel = {
    title: string,
    description: string,
    id: number,
    submittedSolution?: Partial<Solution>,
    submittedSolutions?: Partial<Solution>[]
    submittedAt?: string,
    start: string,
    end: string
}

export interface ServerAssignment {
    title: string, 
    description: string,
    id: number
}

export interface PlannedAssignment {
    id: number | string,
    startDate: Moment,
    endDate: Moment,
    assignment: ServerAssignment,
    solution?: ServerSolution,
    reviewer?: Teacher
}

export interface EvaluatedAssignment extends Omit<PlannedAssignment, 'solution'> {
    students: EvaluatedStudent[]
}