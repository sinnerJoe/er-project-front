import { Col, Popover, Row, Space, Table, Tooltip, Typography } from 'antd';
import moment from 'moment';
import LabeledData from 'components/extended-assignment/LabeledData';
import MarkView from 'components/mark-input/MarkView';
import { ServerSolution } from 'interfaces/Solution';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { UserSummary } from 'shared/interfaces/User';
import { extractEducationalYear } from 'utils/datetime';
import { FieldTimeOutlined } from '@ant-design/icons';
import RemovableMark from 'components/removable-mark/RemovableMark';

const {Text, Title} = Typography;

export interface EvaluationSummaryProps {
    user: UserSummary,
    onRefresh: () => void
};

export default function EvaluationSummary({ user, onRefresh }: EvaluationSummaryProps) {
    const categorizedSolutions = useMemo(() => groupSolutionsByYear(user.evaluatedSolutions), [user]);
    const rows = (categorizedSolutions.map(({ solutions, year }) =>
        <Row align="middle">
            <Col className="mr-5">
                <Title level={5} className="mt-0 mb-0" >
                    <FieldTimeOutlined /> {year}
                </Title>
            </Col>
            <Col>
                <Space wrap direction="horizontal" size="middle">
                    {
                        solutions.map((solution) => {
                            return (
                                <Popover trigger="hover" content={
                                    <div>
                                        <LabeledData label="Reviewed At">
                                            {solution.reviewedAt}
                                        </LabeledData>
                                        <LabeledData label="Assignment">
                                            {solution.assignment?.title}
                                        </LabeledData>
                                    </div>
                                }>
                                    <RemovableMark onRemove={onRefresh} solutionId={solution.id} mark={solution.mark || undefined} key={solution.id} />
                                </Popover>
                            )
                        })
                    }
                </Space>
            </Col>
        </Row>
    )
    )

    return <Space direction="vertical" size="small">
        {rows}
    </Space>
}


function groupSolutionsByYear(solutions: ServerSolution[]) {
    const result: Record<string | number, ServerSolution[]> = {};

    solutions.forEach(solution => {
        const year = extractEducationalYear(moment(solution.reviewedAt));
        if (!result[year]) {
            result[year] = [solution];
        }
        else {
            result[year].push(solution)
        }
    });

    return Object.entries(result).map(([year, solutions]) => ({ year, solutions }))
}