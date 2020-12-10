import {Moment } from 'moment';
import { IdIndex } from 'shared/interfaces/Id';
import { PlannedAssignment } from "./Assignment";

export interface Plan {
    id?: IdIndex,
    name: string,
    updatedAt: Moment,
    plannedAssignments: PlannedAssignment[]
}