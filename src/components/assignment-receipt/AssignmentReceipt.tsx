import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import MultilineText from 'components/multiline-text/MultilineText';
import { ServerAssignment } from 'interfaces/Assignment';
import paths from 'paths';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DeleteAssignmentButton from './DeleteAssignmentButton';

const { Text } = Typography;

export interface AssignmentReceiptProps extends ServerAssignment {
    onChange: () => void
};

export default function AssignmentReceipt({
    updatedAt,
    title,
    description,
    id,
    onChange,
    plannedAssignments = [],
}: AssignmentReceiptProps) {

    return (
        <Card title={title}>
            <MultilineText>
                {description}
            </MultilineText>
            <Row
                className="mt-4"
                justify="space-between"
                align="middle"
            >
                <Col>
                    <Text type="secondary">
                        Updated at {updatedAt}
                    </Text>
                </Col>
                <Col>
                    <Space direction="horizontal" size="small">


                        <DeleteAssignmentButton id={id} onDelete={onChange} plannedAssignments={plannedAssignments} />

                        <Link to={`${paths.EDIT_ASSIGNMENT}/${id}`}>
                            <Button type="primary" icon={<EditFilled />}>
                                Edit
                    </Button>
                        </Link>
                    </Space>
                </Col>

            </Row>
        </Card>
    )
}