import React, { ReactNode } from 'react'
import { Row, Col, Button, Space, Typography, Carousel, Image, Popover } from 'antd'

import paths from 'paths';
import './UploadedDiagram.scss';
import { LinkOutlined, DeleteFilled, EditFilled, CaretRightOutlined, EyeOutlined, EyeFilled } from '@ant-design/icons';
import InfoLabel from 'components/info-label/InfoLabel';
import { Solution, SolutionTab } from 'interfaces/Solution';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AssignmentModel } from 'interfaces/Assignment';
import AttachmentLink from 'components/attachment-link/AttachmentLink';
import { changeSolutionTitle, deleteSolution } from 'shared/endpoints';
import SubmittedMark from 'components/submitted-mark/SubmittedMark';
import { IMG_FALLBACK } from 'shared/constants';
import PreviewImage from 'components/preview-image/PreviewImage';
import PromiseButton from 'components/promise-button/PromiseButton';
import { openConfirmPromise } from 'utils/modals';
import EditableField from 'components/editable-field/EditableField';

const { Title, Text } = Typography;



type Props = { onRefresh: () => void } & Solution;

export default function UploadedDiagram({
    reviewedAt,
    mark,
    reviewer,
    title,
    onRefresh,
    tabs = [],
    updatedOn = new Date().toISOString(),
    id,
    assignment
}: Props) {

    const renderImagePreview = (poster?: string, index: number = 0) => <PreviewImage poster={poster} key={index} />;

    const reviewed = !!reviewedAt;

    const deleteButton = (
        <span>
            <PromiseButton
                icon={<DeleteFilled />}
                disabled={reviewed}
                onClick={() => {
                    if (id != null) {
                        return openConfirmPromise({
                            onOk: () => {
                                return deleteSolution(id).then(onRefresh);
                            },
                            content: (
                                <span>
                                    Are you sure you want to remove the solution <Text strong>{title}</Text>? 
                                    <div className="text-center mt-2">
                                        <Text strong type="danger">This change is irreversible!</Text>
                                    </div>
                                </span>
                            )
                        })
                    }
                }}
                className="standard-button" type="primary" danger>
                Delete
            </PromiseButton>
        </span>
    )

    return (
        <Row justify="space-between" align="middle" className="uploaded-diagram">
            <Col className="meta-info pt-1" md={10} lg={8}>
                    <Title className="mb-5" level={4}>
                <EditableField initialValue={title} 
                    onSave={(newTitle) => changeSolutionTitle(id, newTitle, onRefresh)}>
                        <span>
                            {title}
                        </span>
                </EditableField>
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
                {reviewedAt && (
                    <InfoLabel text="Review">
                        <SubmittedMark reviewedAt={reviewedAt || undefined} mark={mark} reviewer={reviewer} />
                    </InfoLabel>
                )}
            </Col>
            <Col md={8}>
                <Image.PreviewGroup>

                    {tabs.length > 1 && <Carousel verticalSwiping dotPosition="left" dots={{ className: 'black-dots' }}>

                        {tabs.map(({ poster }, index) => renderImagePreview(poster, index))}

                    </Carousel>
                    }
                    {tabs.length == 1 && renderImagePreview(tabs[0].poster)}
                </Image.PreviewGroup>
            </Col>
            <Col>
                <Space direction="vertical">

                    <Link to={`${paths.EDIT_DIAGRAM}?solId=${id}`}>
                        <Button icon={!reviewed ? <EditFilled />: <EyeFilled />}  className="standard-button" type="primary">
                            {!reviewed ? 'Edit' : 'View'}
                        </Button>
                    </Link>

                    {!reviewed ? deleteButton : 
                        <Popover 
                            trigger="hover" 
                            content={<Text>Cannot delete reviewed solutions.</Text>}>
                            {deleteButton}
                        </Popover>
                    }

                </Space>

            </Col>
        </Row>
    )
}