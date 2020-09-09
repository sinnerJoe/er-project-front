import { Assignment } from "./Assignment";

export type SolutionTab = {
    title: string,
    diagramXml?: string,
    poster?: string
};

export type Solution = {
    tabs: Partial<SolutionTab>[],
    updatedOn: string,
    id: number,
    assignments: Partial<Assignment>[]
};