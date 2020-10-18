import React, { useCallback, useEffect } from 'react'
import _ from 'lodash';
import moment from 'moment';
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { Button, Col, DatePicker, Form, Input, Row } from 'antd';
import { getAssignment, updateAssignment, createAssignment } from 'actions/assignments';
import { FormInstance } from 'antd/lib/form';
import { PartialBy } from 'interfaces/helpers';
import { AssignmentModel } from 'interfaces/Assignment';
import Title from 'antd/lib/typography/Title';
import PageContent from 'components/page-content/PageContent';
import paths from 'paths';

type FormFields ={description: string, title:string, timeRange: [moment.Moment, moment.Moment]};

const prepareAssignmentData = (formData: FormFields): PartialBy<AssignmentModel, 'id'> => {
    return {
        description: formData.description,
        title: formData.title,
        start: formData.timeRange[0].format(),
        end: formData.timeRange[1].format()
    }
}

const prepareFormData = (assignment: AssignmentModel) => {
    return {
        description: assignment.description,
        title: assignment.title,
        timeRange: [assignment.start, assignment.end].map(v => moment(v))
    }
}

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
}

export default function EditAssignmentPage(props: any) {
    const location = useLocation();
    const history = useHistory();
    const [form] = Form.useForm();

    const { id: assignmentId }  = useParams<{id: string | undefined}>();
    console.log(assignmentId)
    useEffect(() => {
        if (!_.isNil(assignmentId)) {
            getAssignment(Number(assignmentId)).then((data) => form.setFieldsValue(prepareFormData(data)))
        }
    }, [assignmentId]);

    const onFinish = useCallback(
        (values: FormFields) => {
            const assignmentData = prepareAssignmentData(values);
            let promise = !_.isNil(assignmentId) 
                          ?  updateAssignment(Number(assignmentId), assignmentData) 
                          :  createAssignment(assignmentData);
            promise.then(response => {
                history.push(paths.PROFESSOR_ASSIGNMENTS);
            });
        },
        [assignmentId],
    )

    const title = _.isNil(assignmentId) ? "Create new assignment" : "Edit assignment";

    return (
        <PageContent>
            <Row justify="center" className="mt-4 mb-4"><Title level={3}>{title}</Title></Row>
            <Row className="pl-4 pr-4" justify="start">
                <Col>
                    <Form {...layout} form={form} name="assignment-form" onFinish={onFinish}>
                        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea rows={15} />
                        </Form.Item>
                        <Form.Item name="timeRange" label="Solution submit interval" rules={[{required: true}]} >
                            <DatePicker.RangePicker showMinute={false} placeholder={['Begin date', 'End date']} showTime format="MMM DD HH:mm" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </PageContent>
    )

}