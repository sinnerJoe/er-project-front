import React, { useState } from 'react'
import { Card, Space, Typography, Collapse, Row, Button } from 'antd'
import { Solution } from 'interfaces/Solution'
import { AssignmentModel } from 'interfaces/Assignment'
import SubmissionTable from './SubmissionTable'
import LabeledData from './LabeledData'
import Assignment from 'components/assignment/Assignment'
import { DATE_WITHOUT_YEAR } from 'shared/constants'
import moment from 'moment'
import { EditFilled, FieldTimeOutlined } from '@ant-design/icons'
import { Link as RouterLink } from 'react-router-dom';
import paths from 'paths'

const { Text, Link } = Typography;


type Props = {
    submissions: Partial<Solution>[],
    assignment: AssignmentModel,
    onRefreshData: () => void
}

export default function ExtendedAssignment(props: Props) {

    const [expanded, setExpanded] = useState(false);

    let linkText = 'Hide submissions'
    if (!expanded) {
        const uncheckedSubmissionCount = props.submissions.filter(s => !s.mark).length;
        if (uncheckedSubmissionCount > 0) {
            linkText = `Expand submissions(${props.submissions.length} total, ${uncheckedSubmissionCount} to be evaluated)`
        } else {
            linkText = `Expand submissions(${props.submissions.length} total)`
        }
    }

    return (
        <Card title={props.assignment.title}>
            <LabeledData label="Description">
                <p>
                    {props.assignment.description}
                </p>
            </LabeledData>
            <Space direction="vertical" size="small" className="full-width mt-4">
                <LabeledData label="Start Date">
                    <FieldTimeOutlined className="mr-1" />
                    {moment(props.assignment.start).format(DATE_WITHOUT_YEAR)}
                </LabeledData>
                <LabeledData label="End Date">
                    <FieldTimeOutlined className="mr-1" />
                    {moment(props.assignment.end).format(DATE_WITHOUT_YEAR)}
                </LabeledData>
                <Link onClick={() => setExpanded(!expanded)}>{linkText}</Link>
                {expanded && (
                    <SubmissionTable
                        submissions={props.submissions}
                        onRefreshData={props.onRefreshData}
                    />
                )}
            </Space>
            <Row className="full-width mt-2" justify="end">

                <RouterLink to={`${paths.EDIT_ASSIGNMENT}/${props.assignment.id}`}>
                    <Button type="primary">
                        <Row align="middle"><EditFilled className="mr-2" /> Edit </Row>
                    </Button>
                </RouterLink>
            </Row>
        </Card >
    )
}