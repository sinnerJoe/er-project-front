import { Button, Col, Row, Typography } from 'antd';
import CoordinatorPickerModal from 'components/modals/coordinator-picker-modal/CoordinatorPickerModal';
import { useModal } from 'components/modals/modal-hooks';
import PlanPickerModal from 'components/modals/plan-picker-modal/PlanPickerModal';
import StudentPickerModal from 'components/modals/student-picker-modal/StudentPickerModal';
import { CollegeGroup } from 'interfaces/Group';
import { Plan } from 'interfaces/Plan';
import StudentListTable from './StudentListTable';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { setGroupCoordinator, setGroupPlan, setStudentGroup } from 'shared/endpoints';
import { ExclamationOutlined, PlusOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { openConfirmPromise } from 'utils/modals';
import { Student, Teacher } from 'shared/interfaces/User';

const { Title, Link } = Typography;

export interface GroupEditProps extends CollegeGroup {
    onChange: () => void
};

export default function GroupEdit({ id, name, students, year, coordinator, plan, onChange }: GroupEditProps) {

    const [planPickerInstance, openPlanPicker] = useModal(PlanPickerModal, {
        onOk: ({ id: planId }: Plan) => {
            if (planId != null) {
                return setGroupPlan(id, planId).then(onChange);
            }
        },
        initialValue: plan || null,
    });

    const [coordinatorPicker, openCoordinatorPicker] = useModal(CoordinatorPickerModal, {
        onOk: ({ id: coordinatorId }: Teacher) => {
            if (coordinatorId != null) {
                return setGroupCoordinator(id, coordinatorId).then(onChange);
            }
        },
        initialValue: coordinator || null,
    });

    const [studentPicker, openStudentPicker] = useModal(StudentPickerModal, {
        onOk: ({ group, id: studentId }: Student) => {
            const changeGroup = () => setStudentGroup(studentId, id);
                if(group) { 
                    return openConfirmPromise({
                        icon: <ExclamationOutlined/>, 
                        content: `Are you sure you want to move the student from ${group.name} to ${name}?`,
                        onOk: changeGroup
                    }).then(onChange);
                } 
            if (studentId != null) {
                return changeGroup().then(onChange);
            }
        },
        excluded: students
    });

    return (
        <div>
            <Row>

                <Col span={24} sm={12}>
                    <Title className="mt-5" level={5}>
                        Coordinator
                        </Title>
                    <Link onClick={openCoordinatorPicker}>
                        {
                            !coordinator ? 'Choose a coordinator'
                                : `${coordinator.firstName} ${coordinator.lastName} (Change)`
                        }
                    </Link>
                    {coordinatorPicker}
                </Col>
                <Col span={24} sm={12}>
                    <Title className="mt-5" level={5}>
                        Educational Plan
                    </Title>

                    <Link onClick={openPlanPicker}>
                        {
                            !plan ? 'Choose an educational plan'
                                : `${plan.name} (Change)`
                        }
                    </Link>

                    {planPickerInstance}
                </Col>
            </Row>


            <div className="mt-5">
                <Button icon={<PlusOutlined />} type="primary" onClick={openStudentPicker}>
                    Add student
                </Button>
                {studentPicker}
                <div className="mt-2">

                    <StudentListTable
                        data={students || []}
                        onChange={onChange}
                    />
                </div>
            </div>

        </div>
    )
}