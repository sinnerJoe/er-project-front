import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Col, Image, Modal, Row, Select, Typography } from 'antd'
import { ServerSolution, Solution } from 'interfaces/Solution'
import { useLoadingRequest } from 'utils/hooks';
import { fetchSolution, getOwnSolutions } from 'shared/endpoints';
import PickerModal, { PickerModalProps, StandardOverridenProps } from '../picker-modal/PickerModal';
import './PickSolutionModal';
import PreviewImage from 'components/preview-image/PreviewImage';


const { Text } = Typography;
export interface PickSolutionModalProps extends Omit<PickerModalProps<ServerSolution>, StandardOverridenProps> {
    onOk: (solution: ServerSolution) => Promise<unknown> | void;
    visible: boolean,
    initialValue: ServerSolution | null
}
export default function PickSolutionModal({ visible, initialValue, onOk, ...rest }: PickSolutionModalProps) {
    const [request, data, loading, err] = useLoadingRequest(getOwnSolutions, []);
    useEffect(() => {
        if (visible) {
            request();
        }
    }, [visible]);

    const selected = useMemo(() => data.find(v => v.id === initialValue?.id) || null, [data]);

    const displayedSolutions = useMemo(() => data.filter(solution => !solution.reviewedAt), [data]);

    return (
        <PickerModal
            initialSelected={selected}
            title="Submit solution"
            okText="Submit"
            data={displayedSolutions}
            loading={loading}
            onOk={(selected) => {
                return onOk(selected);
            }}
            visible={visible}
            {...rest}
            renderItem={(solution) => {

                return (
                    <React.Fragment>
                        <Row >
                            <Col span={12}>
                                {solution.title}
                            </Col>
                            <Col span={12}>
                                <Image.PreviewGroup>
                                    <Row wrap gutter={[4, 4]}>
                                        {solution.diagrams.map((diagram) => (
                                        <Col 
                                            className="pick-solution-modal preview" 
                                            style={{ width: '50px' }} 
                                            key={diagram.id}>
                                            <PreviewImage heightPercent={100} title={diagram.name} poster={diagram.image} />
                                        </Col>)
                                        )
                                        }
                                    </Row>
                                </Image.PreviewGroup>
                            </Col>
                        </Row>
                        <Text type="secondary">
                            Updated at {solution.updatedAt}
                        </Text>
                    </React.Fragment>
                )
            }}
        />
    )
}