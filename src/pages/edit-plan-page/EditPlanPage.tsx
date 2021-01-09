import PageContent from 'components/page-content/PageContent';
import PlanEditor, { SentPlannedAssignment } from 'components/plan-editor/PlanEditor';
import paths from 'paths';
import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { addPlannedAssignments, createPlan, fetchPlan, removePlannedAssignments, updatePlanName, updatePlannedAssignments } from 'shared/endpoints';
import { notify } from 'shared/error-handlers';
import { IdIndex } from 'shared/interfaces/Id';
import { normalizePlanDates } from 'utils/datetime';
import { useLoadingRequest } from 'utils/hooks';

export default function EditPlanPage(props: {}) {

    const [request, data, loading, err] = useLoadingRequest(fetchPlan, null, {initialLoading: true});

    const {id} = useParams<{id?: string}>();

    const history = useHistory();

    useMemo(() => {
        if(data) {
            normalizePlanDates(data);
        }
    }, [data]);


    useEffect(() => {
        if(id) {
            request(id);
        }
    }, [id]);

    const handleSave = async (name:string, {added, removed, modified}: {added: SentPlannedAssignment[], removed: IdIndex[], modified: Partial<SentPlannedAssignment>[]}) => {        
        return Promise.all([
            name !== data?.name ? updatePlanName(id as string, name) : Promise.resolve({}),
            added.length ? addPlannedAssignments(id as string, added) : Promise.resolve({}),
            removed.length ? removePlannedAssignments(removed) : Promise.resolve({}),
            modified.length ? updatePlannedAssignments(modified): Promise.resolve({})
        ]).then(() => request(id as string)).then(() => {
            notify({
                description: 'Educational plan updated successfully',
                type: 'success',
                message: 'Request succeded'
            })({} as any);
        }).then(() => history.push(paths.PLANS))
    } 

    let content = null;

    if(!loading && data) {
        content = <PlanEditor onSave={handleSave} initialState={data} />
    }


    return (
        <PageContent>
            <div className="mt-8">
                {content}
            </div>
        </PageContent>
    )
}