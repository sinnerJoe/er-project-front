import { Solution } from "./Solution";

export type Assignment = {
    title: string,
    id: number,
    submittedSolutions: Partial<Solution>
}