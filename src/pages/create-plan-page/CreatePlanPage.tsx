import PageContent from 'components/page-content/PageContent';
import PlanEditor, { SentPlannedAssignment } from 'components/plan-editor/PlanEditor';
import { PlannedAssignment } from 'interfaces/Assignment';
import paths from 'paths';
import React, {useState, useRef, useCallback, useMemo} from 'react';
import { useHistory } from 'react-router-dom';
import { addPlannedAssignments, createPlan, removePlannedAssignments } from 'shared/endpoints';
import { IdIndex } from 'shared/interfaces/Id';
import { unwrapResponse } from 'utils/requests';

export interface CreatePlanPageProps {
    
};

export default function CreatePlanPage(props: CreatePlanPageProps) {

    const history = useHistory();

    const handleSave = async (name:string, {added, removed}: {added: SentPlannedAssignment[], removed: IdIndex[]}) => {
        const {id} = await unwrapResponse(createPlan(name));

        await Promise.all([
            added.length ? addPlannedAssignments(id, added) : Promise.resolve({}),
            removed.length ? removePlannedAssignments(removed) : Promise.resolve({}),
        ]);
        history.push(`${paths.EDIT_PLAN}/${id}`);
    } 

    return (
        <PageContent>
            <div className="mt-8">
                <PlanEditor onSave={handleSave}/>
            </div>
        </PageContent>
    )
}