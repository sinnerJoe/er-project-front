import PageContent from 'components/page-content/PageContent';
import PlanEditor, { SentPlannedAssignment } from 'components/plan-editor/PlanEditor';
import { PlannedAssignment } from 'interfaces/Assignment';
import React, {useState, useRef, useCallback, useMemo} from 'react';
import { addPlannedAssignments, createPlan, removePlannedAssignments } from 'shared/endpoints';
import { IdIndex } from 'shared/interfaces/Id';

export interface CreatePlanPageProps {
    
};

export default function CreatePlanPage(props: CreatePlanPageProps) {

    const handleSave = async (name:string, {added, removed}: {added: SentPlannedAssignment[], removed: IdIndex[]}) => {
        const response = await createPlan(name);
        console.log(response)

        return Promise.all([
            added.length ? addPlannedAssignments(response.data.data.id, added) : Promise.resolve({}),
            removed.length ? removePlannedAssignments(removed) : Promise.resolve({}),
        ]);
    } 

    return (
        <PageContent>
            <div className="mt-8">
                <PlanEditor onSave={handleSave}/>
            </div>
        </PageContent>
    )
}