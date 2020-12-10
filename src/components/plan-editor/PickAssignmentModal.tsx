import { Col, Row, Typography } from 'antd';
import _ from 'lodash';
import Modal from 'antd/lib/modal/Modal';
import DirectionIcon from 'components/direction-icon/DirectionIcon';
import MultilineText from 'components/multiline-text/MultilineText';
import { ServerAssignment } from 'interfaces/Assignment';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { fetchAllAssignments, fetchAssignment } from 'shared/endpoints';
import { useLoadingRequest } from 'utils/hooks';
import './PickAssignmentModal.scss';
const { Text } = Typography;

async function fetchUnpickedAssignments(existingAssignments: ServerAssignment[]) {
    const response = await fetchAllAssignments();
    console.log(response.data.data, existingAssignments)
    response.data.data = response.data.data.filter(assign => !existingAssignments.find(v => assign.id === v.id));
    return response;
}

export interface PickAssignmentModalProps {
    onPick: (assignment: ServerAssignment) => void,
    onClose: () => void
    visible: boolean,
    pickedAssignments: ServerAssignment[]
};

export default function PickAssignmentModal(props: PickAssignmentModalProps) {

    const [chosenAssignment, chooseAssignment] = useState<ServerAssignment | null>(null);

    const [request, assignments, loading] = useLoadingRequest(fetchUnpickedAssignments, [], true);

    const [expandedAssignment, expand] = useState<ServerAssignment | null>(null);

    useEffect(() => {
        if (props.visible) {
            request(props.pickedAssignments).catch();
        }
    }, [props.visible])


    return (
        <Modal
            title="Add Planned Assignment"
            visible={props.visible}
            onOk={() => {
                if (chosenAssignment != null) {
                    props.onPick(chosenAssignment as any)
                }
                props.onClose();
            }}
            width={800}
            onCancel={() => {
                props.onClose();
                expand(null);
                chooseAssignment(null);
            }}
            okText="Add"
            okButtonProps={{ disabled: !chosenAssignment }}
        >

            { !loading && assignments.map((assign) => {
                const isSelected = assign === chosenAssignment;
                const isOpen = assign === expandedAssignment;
                const selectedClass =  isSelected ? "selected-entry" : "";
                const openedClass = isOpen ? "open" : ""
                return (
                    <div
                        className={ `pt-2 pl-3 pr-3 modal-assignment-entry ${selectedClass} ${openedClass}` }
                        onClick={() => chooseAssignment(assign)}>
                            <h3 className="bold title">
                            <Row>

                            <Col>
                                {assign.title}
                            </Col>
                            <Col className="ml-auto" span={1}>
                                <DirectionIcon open={isOpen} onClick={(e) => {
                                    expand(isOpen ? null : assign);
                                    e.stopPropagation();
                                }}
                                />
                            </Col>
                            </Row>
                            </h3>
                            <Text className="description mb-2">
                                <MultilineText>
                                    {assign.description}
                                </MultilineText>
                            </Text>

                    </div>
                );
            })
            }
            {/* TODO: Display something in these cases */}
            {loading ? "Loading data" : ""} 
            {!loading && assignments.length === 0 ? "No data": ""}

        </Modal>
    )
}