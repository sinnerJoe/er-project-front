import { Moment } from "moment";
import { IdIndex } from "shared/interfaces/Id";
import { Student, Teacher } from "shared/interfaces/User";
import { AssignmentModel, ServerAssignment } from "./Assignment";

export type SolutionTab = {
    title: string,
    diagramXml?: string,
    poster?: string,
};

export type Solution = {
    tabs: Partial<SolutionTab>[],
    title: string,
    updatedOn: string,
    id: number,
    mark?: IdIndex,
    reviewer?: Teacher,
    assignment?: ServerAssignment,
    reviewedAt: string | null,
    userId: IdIndex
};

export interface ServerDiagram {
    id: number,
    name: string,
    content: string,
    image: string,
    type: string
}
export interface ServerSolution {
    id: number,
    title: string,
    userId: number,
    plannedAssignmentId: number,
    createdAt: string,
    updatedAt: string,
    mark: number | null,
    reviewedAt?: string | null,
    reviewer?: Teacher,
    assignment?: ServerAssignment,
    submittedAt: string | Moment,
    diagrams: ServerDiagram[]
}

export interface EvaluatedSolution extends Omit<ServerSolution, 'reviewedBy'>{
    reviewedBy?: Teacher
}   

export function parseSolution(solution: ServerSolution): Partial<Solution> {
    return {
        id: solution.id,
        title: solution.title,
        userId: solution.userId,
        mark: solution.mark,
        updatedOn: solution.updatedAt,
        assignment: solution.assignment,
        tabs: solution.diagrams.map(diagram => ({
          diagramXml: diagram.content,
          poster: diagram.image,
          title: diagram.name,
          type: diagram.type
        } as SolutionTab)),
        reviewer: solution.reviewer,
        reviewedAt: solution.reviewedAt
      } as Partial<Solution>;
}