import { DeleteFilled } from '@ant-design/icons';
import { Col, Row, DatePicker, Button, Typography, Table, Space } from 'antd';
import _ from 'lodash';
import { PlannedAssignment, ServerAssignment } from 'interfaces/Assignment';
import moment, { Moment } from 'moment';
import paths from 'paths';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PickAssignmentModal from './PickAssignmentModal';
import { IdIndex } from 'shared/interfaces/Id';
import DateInterval from 'components/date-interval/DateInterval';
import { ColumnsType } from 'antd/lib/table';
import { DATE_WITHOUT_YEAR } from 'shared/constants';

const { Text } = Typography;

const { RangePicker } = DatePicker;

export enum PlannedAssignmentMode {
    Edit,
    View
}

export interface PlannedAssignmentsListProps {
    value?: Partial<PlannedAssignment>[],
    onChange?: (assignments: Partial<PlannedAssignment>[]) => void,
    mode: PlannedAssignmentMode
};

export default function PlannedAssignmentsList({ onChange = _.noop, value = [], mode }: PlannedAssignmentsListProps) {
    const handleDelete = (id: number | string) => onChange(value.filter(assign => assign.id !== id));
    const handleChangeInterval = (id: number | string, interval: { startDate: Moment, endDate: Moment }) => {
        const rowIndex = value.findIndex(assign => assign.id === id);
        if (rowIndex !== -1) {
            const newValue = [...value];
            newValue[rowIndex] = { ...newValue[rowIndex], ...interval };
            onChange(newValue);
        }
    }

    const columns = [
        {
            title: "№",
            width: 20,
            render: (v, record, index) => <span className="text-center">{index + 1}.</span>
        },
        {
            title: "Assignment",
            dataIndex: 'assignment',
            render: (assignment: ServerAssignment) => (
                <span title={assignment.description}>{assignment.title}</span>
            )
        },
        {
            title: "Solve Interval",
            width: 320,
            defaultSortOrder: "ascend",
            sortDirections: ['ascend'],
            sorter: (a: PlannedAssignment, b: PlannedAssignment) => {
                if (a.startDate.isAfter(b.startDate)) {
                    return 1;
                } else if (a.startDate.isSame(b.startDate)) {
                    return 0;
                }

                return -1;
            },
            render: (v, record) => {
                switch (mode) {
                    case PlannedAssignmentMode.Edit:
                        return renderEditableTime(handleChangeInterval, record);

                    default:
                        return <DateInterval start={record.startDate as any} end={record.endDate as any} dateFormat={DATE_WITHOUT_YEAR} />
                }
            },
        },
        {
            dataIndex: 'id',
            width: 110,
            render: (id: number | string) => (
                <Button icon={<DeleteFilled />} onClick={() => handleDelete(id)} danger>
                    Delete
                </Button>
            )
        },
    ] as ColumnsType<PlannedAssignment>;

    if (mode === PlannedAssignmentMode.View) {
        columns.pop();
    }

    return (
        <div>

            <Space size={10} direction="vertical" className="full-width">
                {mode === PlannedAssignmentMode.Edit && <ControlButtons
                    pickedAssignments={value.map(v => v.assignment as ServerAssignment)}
                    onAdd={(assignment) => {
                        onChange([...value, {
                            assignment,
                            endDate: moment().add(1, 'w'),
                            startDate: moment(),
                            id: '_' + value.length
                        }]);
                    }}
                />}

                <Table
                    dataSource={value as PlannedAssignment[]}
                    pagination={false}
                    rowKey="id"
                    size="small"
                    columns={columns}
                />
            </Space>
        </div>
    )
}


function renderEditableTime(handleChangeInterval: (id: IdIndex, data: { startDate: Moment, endDate: Moment }) => void, record: PlannedAssignment) {
    return (
        <RangePicker
            value={[record.startDate, record.endDate]}
            onChange={(data) => {
                if (!!data) {
                    handleChangeInterval(record.id, {
                        startDate: data[0] as Moment,
                        endDate: data[1] as Moment,
                    })
                }
            }} />
    )
}

function ControlButtons(props: {
    onAdd: (assignment: ServerAssignment) => void,
    pickedAssignments: ServerAssignment[]
}) {
    const [visible, setVisible] = useState(false);

    return (
        <React.Fragment>
            <PickAssignmentModal
                onClose={() => setVisible(false)}
                onPick={props.onAdd}
                visible={visible}
                pickedAssignments={props.pickedAssignments}
            />
            <Row justify="start">
                <Button className="mr-2" type="primary" onClick={() => setVisible(true)}>
                    Add Assignment
                </Button>
                <Link target="_blank" to={paths.EDIT_ASSIGNMENT}>
                    <Button type="link">
                        New Assignment
                    </Button>
                </Link>
            </Row>
        </React.Fragment>
    )
}