import { Button, Card, Col, Divider, Row, Space, Typography } from 'antd'
import AttachmentLink from 'components/attachment-link/AttachmentLink';
import DateInterval from 'components/date-interval/DateInterval';
import InfoLabel from 'components/info-label/InfoLabel';
import MarkView from 'components/mark-input/MarkView';
import { useModal } from 'components/modals/modal-hooks';
import PickSolutionModal from 'components/modals/pick-solution-modal/PickSolutionModal';
import MultilineText from 'components/multiline-text/MultilineText';
import PromiseButton from 'components/promise-button/PromiseButton';
import SubmittedMark from 'components/submitted-mark/SubmittedMark';
import { AssignmentModel, PlannedAssignment } from 'interfaces/Assignment'
import { ServerSolution, Solution } from 'interfaces/Solution'
import _ from 'lodash';
import paths from 'paths';
import React, { useState } from 'react'
import { NO_YEAR_HUMAN_READABLE } from 'shared/constants';
import { submitSolution, unsubmitSolution } from 'shared/endpoints';

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


export interface AssignmentProps extends PlannedAssignment {
    onSubmit: () => void
}

export default function Assignment(props: AssignmentProps) {


    const [modalInstance, openModal] = useModal(PickSolutionModal, {
        initialValue: props.solution || null,
        onOk: (selectedSolution: ServerSolution) => submitSolution(selectedSolution.id, props.id).then(props.onSubmit),
    })

    const controlButtons = !props.reviewer ? (
        <React.Fragment>
            <Button onClick={openModal}>
                {props.solution ? 'Change Solution' : 'Submit Solution'}
            </Button>
            {props.solution && <PromiseButton danger onClick={() => {
                const id = props?.solution?.id;

                if (id != null) {
                    return unsubmitSolution(id).then(props.onSubmit);
                }

            }}>
                Unsubmit
                    </PromiseButton>}
        </React.Fragment>
    ) : "Can't change after evaluation";

    return (
        <Card title={props.assignment.title}>
            <p>
                <MultilineText>
                    {props.assignment.description}
                </MultilineText>
            </p>
            <SubmittedSolution
                solution={props.solution}
                assignmentId={props.assignment.id || 0} />
            {props.reviewer && 
            <InfoLabel text="Mark" className="mt-2">
                <SubmittedMark 
                    reviewer={props.reviewer}
                    mark={props.solution?.mark || undefined} 
                    reviewedAt={props.solution?.reviewedAt || undefined} />
            </InfoLabel>}
            <Row align="middle" className="mt-4">
                <Col>
                    <DateInterval dateFormat={NO_YEAR_HUMAN_READABLE} start={props.startDate as any} end={props.endDate as any} />
                </Col>
                <Col className="ml-auto">
                    <Space direction="horizontal" size="small">
                        {modalInstance}
                        {controlButtons}
                    </Space>
                </Col>
            </Row>
        </Card>
    )
}