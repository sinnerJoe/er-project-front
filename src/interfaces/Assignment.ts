import { Moment } from "moment";
import { EvaluatedStudent, Teacher } from "shared/interfaces/User";
import { Plan } from "./Plan";
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
    id: number,
    updatedAt?: string,
    plannedAssignments?: PlannedAssignment[]
}

export interface PlannedAssignment {
    id: number | string,
    startDate: Moment,
    endDate: Moment,
    assignment: ServerAssignment,
    solution?: ServerSolution,
    reviewer?: Teacher,
    plan?: Plan
}

export interface EvaluatedAssignment extends Omit<PlannedAssignment, 'solution'> {
    students: EvaluatedStudent[]
}