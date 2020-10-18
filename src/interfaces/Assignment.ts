import { Solution } from "./Solution";

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