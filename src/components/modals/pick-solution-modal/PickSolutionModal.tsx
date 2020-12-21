import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Col, Image, Modal, Row, Select, Typography } from 'antd'
import { ServerSolution, Solution } from 'interfaces/Solution'
import { useLoadingRequest } from 'utils/hooks';
import { fetchSolution, getOwnSolutions } from 'shared/endpoints';
import PickerModal, { PickerModalProps, StandardOverridenProps } from '../picker-modal/PickerModal';
import './PickSolutionModal';


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



    return (
        <PickerModal
            initialSelected={selected}
            title="Submit solution"
            okText="Submit"
            data={data}
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
                                    <Row>
                                        {solution.diagrams.map((diagram) => {
                                            return <Col className="pick-solution-modal preview"><Image key={diagram.id} width={50} src={diagram.image} className="preview" /></Col>
                                        })
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