import React, { ReactNode } from 'react'
import { Row, Col, Button, Space, Typography } from 'antd'

import paths from 'paths';
import './UploadedDiagram.scss';
import { LinkOutlined, DeleteFilled, EditFilled, CaretRightOutlined } from '@ant-design/icons';
import InfoLabel from 'components/info-label/InfoLabel';
import { Solution, SolutionTab } from 'interfaces/Solution';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AssignmentModel } from 'interfaces/Assignment';
import AttachmentLink from 'components/attachment-link/AttachmentLink';
import { deleteSolution } from 'shared/endpoints';
import SubmittedMark from 'components/submitted-mark/SubmittedMark';

const { Title } = Typography;



type Props = { onDelete: Function } & Solution;

export default function UploadedDiagram({
    reviewedAt,
    mark,
    reviewer,
    title,
    onDelete = () => { },
    tabs = [],
    updatedOn = new Date().toISOString(),
    id,
    assignment
}: Props) {
    return (
        <Row justify="space-between" align="middle" className="uploaded-diagram">
            <Col className="meta-info" md={10} lg={8}>
                <Title className="mb-5" level={4}>
                    {title}
                </Title>
                <InfoLabel text="Diagrams">
                    <ul itemType=''>
                        {tabs.map((tab, key) => (
                            <li key={key}>{tab.title}</li>
                        ))}
                    </ul>
                </InfoLabel>
                <InfoLabel text="Last edit">
                    {updatedOn}
                </InfoLabel>
                {assignment && <InfoLabel text="Submitted to">
                    <i>{assignment.title}</i>
                </InfoLabel>}
                {reviewer && (
                    <InfoLabel text="Review">
                        <SubmittedMark reviewedAt={reviewedAt || undefined} mark={mark} reviewer={reviewer} />
                    </InfoLabel>
                )}
            </Col>
            <Col md={4}>
                <img className="image" src={tabs[0].poster} />
            </Col>
            <Col>
                <Space direction="vertical">

                    <Link to={`${paths.EDIT_DIAGRAM}?solId=${id}`}>
                        <Button className="standard-button" type="primary">
                            <Row align="middle"><EditFilled className="mr-2" /> Edit </Row>
                        </Button>
                    </Link>


                    <Button
                        onClick={() => {
                            if (typeof id !== 'undefined') {
                                deleteSolution(id).then(onDelete as any)
                            }
                        }}
                        className="standard-button" type="primary" danger>
                        <Row align="middle"><DeleteFilled className="mr-2" /> Delete </Row>
                    </Button>

                </Space>

            </Col>
        </Row>
    )
}