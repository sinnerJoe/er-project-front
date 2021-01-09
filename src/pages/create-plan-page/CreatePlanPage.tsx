import PageContent from 'components/page-content/PageContent';
import PlanEditor, { SentPlannedAssignment } from 'components/plan-editor/PlanEditor';
import paths from 'paths';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { addPlannedAssignments, createPlan, removePlannedAssignments } from 'shared/endpoints';
import { notify } from 'shared/error-handlers';
import { IdIndex } from 'shared/interfaces/Id';
import { unwrapResponse } from 'utils/requests';

export interface CreatePlanPageProps {
    
};

export default function CreatePlanPage(props: CreatePlanPageProps) {

    const history = useHistory();

    const handleSave = async (name:string, {added, removed}: {added: SentPlannedAssignment[], removed: IdIndex[]}) => {
        try {
            const {id} = await unwrapResponse(createPlan(name));
            await Promise.all([
                added.length ? addPlannedAssignments(id, added) : Promise.resolve({}),
                removed.length ? removePlannedAssignments(removed) : Promise.resolve({}),
            ]);
            notify({
                description: `Educational plan "${name}" created successfully.`,
                type: "success",
                message: "Request succeded"
            })({} as any);
            history.push(`${paths.EDIT_PLAN}/${id}`);
        } finally {}
    } 

    return (
        <PageContent>
            <div className="mt-8">
                <PlanEditor onSave={handleSave}/>
            </div>
        </PageContent>
    )
}