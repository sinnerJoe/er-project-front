import { clearSubmission} from 'actions/assignments';
import { Button, Card, Col, Divider, Row, Space, Typography } from 'antd'
import AttachmentLink from 'components/attachment-link/AttachmentLink';
import DateInterval from 'components/date-interval/DateInterval';
import { useModal } from 'components/modals/modal-hooks';
import PickSolutionModal from 'components/modals/pick-solution-modal/PickSolutionModal';
import PromiseButton from 'components/promise-button/PromiseButton';
import { AssignmentModel, PlannedAssignment } from 'interfaces/Assignment'
import { ServerSolution, Solution } from 'interfaces/Solution'
import _ from 'lodash';
import { Moment } from 'moment';
import paths from 'paths';
import React, { useState } from 'react'
import { NO_YEAR_HUMAN_READABLE } from 'shared/constants';
import { submitSolution, unsubmitSolution } from 'shared/endpoints';
import { IdIndex } from 'shared/interfaces/Id';

const { Text, Link } = Typography;



function SubmittedSolution(props: {
    solution?: ServerSolution,
    assignmentId: number,
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
                                    (Submitted on {props.solution.submittedAt})
                        </Text>
                            </span>

                        )

                    }
                </Col>

            </Row>
        </Space>
    )
}

function SubmittedMark(props: {mark?: IdIndex | null, reviewedAt?: string | Moment}) {
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
                <Text type="secondary">{`(${props.reviewedAt || new Date().toISOString()})`}</Text>
            </div>
        </div>
    )
}


export interface AssignmentProps extends PlannedAssignment {
    onSubmit: () => void
}

export default function Assignment(props: AssignmentProps) {


    const [modalInstance, openModal] = useModal(PickSolutionModal, {
        initialValue: props.solution || null,
        onOk: (selectedSolution: ServerSolution) => submitSolution(selectedSolution.id, props.id).then(props.onSubmit),
    })

    return (
        <Card title={props.assignment.title}>
            <p>
                {props.assignment.description}
            </p>
            <SubmittedSolution
                solution={props.solution}
                assignmentId={props.assignment.id || 0} />
            <SubmittedMark mark={props.solution?.mark} reviewedAt={props.solution?.reviewedAt || undefined}  />
            <Row align="middle" className="mt-4">
                <Col>
                    <DateInterval dateFormat={NO_YEAR_HUMAN_READABLE} start={props.startDate as any} end={props.endDate as any} />
                </Col>
                <Col className="ml-auto">
                    <Space direction="horizontal" size="small">
                        {modalInstance}
                        <Button onClick={openModal}>
                            {props.solution ? 'Change Solution' : 'Submit Solution'}
                        </Button>
                        {props.solution && <PromiseButton danger onClick={() => {
                            const id = props?.solution?.id;

                            if(id != null) {
                                return unsubmitSolution(id).then(props.onSubmit);
                            }

                        }}>
                            Unsubmit
                    </PromiseButton>}
                    </Space>
                </Col>
            </Row>
        </Card>
    )
}