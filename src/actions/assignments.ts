import { OmitProps } from "antd/lib/transfer/ListBody";
import moment from "antd/node_modules/moment";
import { AssignmentModel } from "interfaces/Assignment";
import { PartialBy } from "interfaces/helpers";
import { omit } from "lodash";
import { getSolution, getSolutions, getSynchronizedSolution } from "./diagram";
import {fakeGet} from './faker'; 

var assignments: AssignmentModel[] = [
    {
        description: "Lorem ipsun one two three",
        id:0,
        title: "FIRST test assignment",
        start: moment().format(),
        end: moment().add(4, 'days').format(),
        submittedSolutions: [
            getSynchronizedSolution(1),
            getSynchronizedSolution(2)
        ]
    },
    {
        description: "Lorem ipsun one two three",
        id:1,
        title: "Second test assignment",
        start: moment().format(),
        end: moment().add(4, 'days').format(),
        submittedSolutions: [
            getSynchronizedSolution(2)
        ]
    },
    {
        description: "Lorem ipsun one two three",
        id:2,
        title: "Third test assignment",
        start: moment().format(),
        end: moment().add(4, 'days').format()
    },
];

export async function getAssignments(): Promise<AssignmentModel[]> {
    const solutions = await getSolutions();
    return assignments.map(a => ({
        ...a, 
        submittedSolution: solutions?.find(obj => a.submittedSolution?.id === obj.id),
        submittedSolutions: a.submittedSolutions?.map((sol) => getSynchronizedSolution(sol.id || 0)) 
    }));
}

export async function submitSolution(assignmentId: number, solutionId: number) {
    const solution = await getSolution(solutionId);
    console.log("SUBMITING", solution)
    assignments[assignmentId] = { 
        ...assignments[assignmentId], 
        submittedSolution: solution,
        submittedAt: new Date().toDateString()
    }
    console.log("CHANGED ASSIGNMENTS", assignments[assignmentId])
    solution.assignments = [assignments[assignmentId]];
    return {ok: true};
}

export async function clearSubmission(assignmentId: number) {
    assignments[assignmentId].submittedAt = undefined;
    assignments[assignmentId].submittedSolution = undefined;
    return fakeGet({ok: true});
}

export async function getAssignment(assignmentId: number) {
    return fakeGet(assignments[assignmentId]);
}

export async function updateAssignment(assignmentId: number, data: Partial<AssignmentModel>) {
    assignments[assignmentId] = {...assignments[assignmentId], ...data};
    return fakeGet({ok: true});
}

export async function createAssignment(data: PartialBy<AssignmentModel, "id">) {
    const fullData: AssignmentModel = {...data, id: assignments.length};
    assignments.push(fullData);
    return fakeGet({ok: true});
}

export function getSynchronousAssignments() {
    return assignments;
}