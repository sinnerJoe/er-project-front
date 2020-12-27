import React, { useEffect, useState } from 'react'
import { Card, Space, Typography, Collapse, Row, Button } from 'antd'
import { Solution } from 'interfaces/Solution'
import { AssignmentModel, EvaluatedAssignment } from 'interfaces/Assignment'
import SubmissionTable from './SubmissionTable'
import LabeledData from './LabeledData'
import Assignment from 'components/assignment/Assignment'
import { DATE_WITHOUT_YEAR } from 'shared/constants'
import moment from 'moment'
import { EditFilled, FieldTimeOutlined } from '@ant-design/icons'
import { Link as RouterLink } from 'react-router-dom';
import paths from 'paths'
import MultilineText from 'components/multiline-text/MultilineText'
import { useEffectSkip, useLoadingRequest } from 'utils/hooks'
import { IdIndex } from 'shared/interfaces/Id'
import { getPlannedAssignmentsWithAnswers, getSubmissionGroups } from 'shared/endpoints'

const { Text, Link } = Typography;


export interface ExtendedAssignmentProps {
    onRefreshData: () => void,
    groupId: IdIndex,
    assignment: EvaluatedAssignment
}

export default function ExtendedAssignment({groupId, onRefreshData, assignment: evaluatedAssignment}: ExtendedAssignmentProps) {
    const [data, setData] = useState(evaluatedAssignment);
    const {
        id,
        assignment, 
        endDate, 
        startDate,
        students
    }  = data;

    useEffect(() => {
        setData(evaluatedAssignment);
    }, [evaluatedAssignment]);

    const [requestAssignment, assignmentData, loading] = useLoadingRequest(getPlannedAssignmentsWithAnswers, []);

    useEffect(() => {
        if(assignmentData.length) {
            setData(assignmentData[0]);
        }
    }, [assignmentData]);

    const handleRefresh = () => {
        onRefreshData();
        requestAssignment(groupId, id);
    }

    const [expanded, setExpanded] = useState(false);

    let linkText = 'Hide submissions'
    if (!expanded) {
        const uncheckedSubmissionCount = students.reduce((acc, s) => {
            if(!s.solution || s.solution.reviewedAt) {
                return acc;
            } 
            return acc + 1;
        },0);
        const totalSubmissions = students.reduce((acc, s) => s.solution ? acc + 1: acc, 0);
        if (uncheckedSubmissionCount > 0) {
            linkText = `Expand submissions(${totalSubmissions} total, ${uncheckedSubmissionCount} to be evaluated)`
        } else {
            linkText = `Expand submissions(${totalSubmissions} total)`
        }
    }

    return (
        <Card title={assignment.title}>
            <LabeledData label="Description">
                <MultilineText>
                    {assignment.description}
                </MultilineText>
            </LabeledData>
            <Space direction="vertical" size="small" className="full-width mt-4">
                <Space direction="horizontal" size="large">

                <LabeledData label="Start Date">
                    <FieldTimeOutlined className="mr-1" />
                    {moment(startDate).format(DATE_WITHOUT_YEAR)}
                </LabeledData>
                <LabeledData label="End Date">
                    <FieldTimeOutlined className="mr-1" />
                    {moment(endDate).format(DATE_WITHOUT_YEAR)}
                </LabeledData>
                </Space>
                <Link onClick={() => setExpanded(!expanded)}>{linkText}</Link>
                {expanded && (
                    <SubmissionTable
                        startDate={startDate}
                        endDate={endDate}
                        students={students}
                        onRefreshData={handleRefresh}
                    />
                )}
            </Space>
            <Row className="full-width mt-2" justify="end">

                <RouterLink to={`${paths.EDIT_ASSIGNMENT}/${assignment.id}`}>
                    <Button type="primary">
                        <Row align="middle"><EditFilled className="mr-2" /> Edit </Row>
                    </Button>
                </RouterLink>
            </Row>
        </Card >
    )
}