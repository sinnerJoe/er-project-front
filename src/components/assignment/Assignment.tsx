import { clearSubmission, submitSolution } from 'actions/assignments';
import { Button, Card, Col, Divider, Row, Space, Typography } from 'antd'
import AttachmentLink from 'components/attachment-link/AttachmentLink';
import DateInterval from 'components/date-interval/DateInterval';
import PickSolutionModal from 'components/pick-solution-modal/PickSolutionModal';
import { AssignmentModel } from 'interfaces/Assignment'
import { Mark } from 'interfaces/Mark'
import { Solution } from 'interfaces/Solution'
import _ from 'lodash';
import paths from 'paths';
import React, { useState } from 'react'

const { Text, Link } = Typography;



function SubmittedSolution(props: {
    solution?: Partial<Solution>,
    assignmentId: number,
    submittedAt?: string,
}) {
    return (
        <Space direction="vertical" size="small" className="full-width">
            <Text strong>
                Submission
            </Text>

            <Row gutter={[5, 0]} className="full-width">
                <Col>
                    {!props.solution ?
                        (
                            <Text className="ml-2">
                                - None
                            </Text>
                        )
                        :
                        (
                            <span>

                                <Link target="_blank" href={`${paths.EDIT_DIAGRAM}?solId=${props.solution.id}`} >
                                    <AttachmentLink>
                                        {props.solution?.title}
                                    </AttachmentLink>
                                </Link>
                                <Text className="ml-2" type="secondary">
                                    (Submitted on {props.submittedAt})
                        </Text>
                            </span>

                        )

                    }
                </Col>

            </Row>
        </Space>
    )
}

function SubmittedMark(props: Partial<Mark>) {
    if (props.mark == null) {
        return null;
    }

    return (
        <div>
            <label>
                Mark
            </label>
            <div>
                <Text strong>{props.mark}</Text>
                <Text type="secondary">{`(${props.createdAt || new Date().toISOString()})`}</Text>
            </div>
        </div>
    )
}

// function PostedDate({postedAt: string}) {
//     return (

//     )
// }

type Props = {
    assignment: Partial<AssignmentModel>,
    solution?: Partial<Solution>,
    mark?: Mark,
    onSubmit: () => void
}

export default function Assignment(props: Props) {

    const [showModal, setShowModal] = useState(false);

    return (
        <Card title={props.assignment.title}>
            <p>
                {props.assignment.description}
            </p>
            <SubmittedSolution
                solution={props.solution}
                submittedAt={props.assignment.submittedAt}
                assignmentId={props.assignment.id || 0} />
            <SubmittedMark {...props.mark} />
            <Row align="middle" className="mt-4">
                <Col>
                    <DateInterval start={props.assignment.start || ''} end={props.assignment.end || ''} />
                </Col>
                <Col className="ml-auto">
                    <Space direction="horizontal" size="small">
                        <Button onClick={() => setShowModal(true)}>
                            {props.solution ? 'Change Solution' : 'Submit Solution'}
                        </Button>
                        {props.solution && <Button danger onClick={() => clearSubmission(props.assignment.id || 0).then(props.onSubmit)}>
                            Unsubmit
                    </Button>}
                    </Space>
                </Col>
            </Row>
            <PickSolutionModal
                onChoose={(solutionId) => submitSolution(props.assignment.id || 0, solutionId).then(props.onSubmit)}
                onClose={() => setShowModal(false)}
                visible={showModal}
            />
        </Card>
    )
}