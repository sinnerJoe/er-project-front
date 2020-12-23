import { Moment } from "moment";
import { Student, Teacher } from "shared/interfaces/User";
import { PassThrough } from "stream";
import { AssignmentModel } from "./Assignment";
import { Mark } from "./Mark";

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
    assignments: Partial<AssignmentModel>[],
    mark?: Mark
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
    reviewedBy: number | null,
    reviewedAt: string | null,
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
        mark: solution.mark ? solution.mark : undefined,
        updatedOn: solution.updatedAt,
        tabs: solution.diagrams.map(diagram => ({
          diagramXml: diagram.content,
          poster: diagram.image,
          title: diagram.name,
          type: diagram.type
        } as SolutionTab))
      } as Partial<Solution>;
}