import { AssignmentModel } from "./Assignment";
import { Mark } from "./Mark";

export type SolutionTab = {
    title: string,
    diagramXml?: string,
    poster?: string
};

export type Solution = {
    tabs: Partial<SolutionTab>[],
    title: string,
    updatedOn: string,
    id: number,
    assignments: Partial<AssignmentModel>[],
    mark?: Mark
};