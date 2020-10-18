import React, { ReactNode } from 'react'
import { Row, Col, Button, Space } from 'antd'

import paths from 'paths';
import './UploadedDiagram.scss';
import { LinkOutlined, DeleteFilled, EditFilled, CaretRightOutlined } from '@ant-design/icons';
import InfoLabel from 'components/info-label/InfoLabel';
import { Solution, SolutionTab } from 'interfaces/Solution';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AssignmentModel } from 'interfaces/Assignment';
import { deleteDiagram } from 'actions/diagram';
import AttachmentLink from 'components/attachment-link/AttachmentLink';




type Props = { onDelete: Function} & Partial<Solution> 

const testTabs: Partial<SolutionTab>[] = [
    {
        poster: '/images/diagram_image_placeholder.png',
        title:"First tab"
    },
    {
        poster: '/images/diagram_image_placeholder.png',
        title:"First tab"
    },
    {
        poster: '/images/diagram_image_placeholder.png',
        title:"First tab"
    },
];

const testAssignments: Partial<AssignmentModel>[] = [
    {
        title:"Create the schema for UAIC DB."
    }
]

export default function UploadedDiagram({onDelete=() => {}, tabs=testTabs, updatedOn=new Date().toISOString(), id, assignments = testAssignments}: Props) {
    return (
        <Row justify="space-between" align="middle" className="uploaded-diagram">
            <Col className="meta-info">
                <InfoLabel text="Diagrams">
                    <ul itemType=''>
                        {tabs.map((tab, key) => (
                            <li key={key}>{tab.title}</li>
                        ))}
                    </ul>
                </InfoLabel>
                <InfoLabel text="Last edit">
                    {moment(updatedOn).format('DD.MM.YYYY HH:mm')}
                </InfoLabel>
                <InfoLabel text="Submitted to">
                    {assignments.map((assignment, key) => (
                        <Link key={key} to={`${paths.EDIT_DIAGRAM}?`}>
                            <AttachmentLink> 
                                {assignment.title}
                            </AttachmentLink>
                        </Link>
                    ))}
                    {
                        !assignments.length && <i>Nothing</i>
                    }
                </InfoLabel>
            </Col>
            <Col>
                <img className="image" src={tabs[0].poster} />
            </Col>
            <Col>
            <Space direction="vertical">
                
                    <Link to={`${paths.EDIT_DIAGRAM}?solId=${id}`}>
                        <Button className="standard-button" type="primary">
                            <Row align="middle"><EditFilled className="mr-2"/> Edit </Row>
                        </Button>
                    </Link>
                
                
                        <Button 
                        onClick={() => deleteDiagram(id).then(onDelete as any)}
                        className="standard-button" type="primary" danger>
                            <Row align="middle"><DeleteFilled className="mr-2"/> Delete </Row>
                        </Button>
                
            </Space>
                    
            </Col>
        </Row>
    )
}