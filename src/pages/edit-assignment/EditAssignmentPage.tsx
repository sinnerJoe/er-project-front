import React, { useCallback, useEffect } from 'react'
import _ from 'lodash';
import moment from 'moment';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { Button, Col, DatePicker, Form, Input, Row } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { PartialBy } from 'interfaces/helpers';
import { AssignmentModel, ServerAssignment } from 'interfaces/Assignment';
import Title from 'antd/lib/typography/Title';
import PageContent from 'components/page-content/PageContent';
import paths from 'paths';
import CenteredForm from 'components/centered-form/CenteredForm';
import {  updateAssignment, createAssignment, fetchAssignment } from 'shared/endpoints';

type FormFields ={description: string, title:string};

const prepareAssignmentData = (formData: FormFields): PartialBy<ServerAssignment, 'id'> => {
    return {
        description: formData.description,
        title: formData.title
    }
}

const prepareFormData = (assignment: ServerAssignment) => {
    return {
        description: assignment.description,
        title: assignment.title
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
            fetchAssignment(Number(assignmentId)).then(
                (response) => form.setFieldsValue(prepareFormData(response.data.data)))
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
        console.log(form.getFieldValue('description'));
    return (
        <PageContent>
            <CenteredForm onlyHorizontal={true} width={600}>
            <Row justify="center" className="mt-4 mb-4"><Title level={3}>{title}</Title></Row>
            <Row justify="center" className="full-width">
                <Col span="24">
                    <Form {...layout} form={form} className="full-width" name="assignment-form" onFinish={onFinish}>
                        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item rules={[{required: true}]} name="description" label="Description">
                            <Input.TextArea rows={15} />
                        </Form.Item>
                        <Form.Item>
                            <Row justify="end" >
                                <Link className="mr-2" to={paths.PROFESSOR_ASSIGNMENTS}>
                                    <Button type="ghost">
                                        Back
                                    </Button>
                                </Link>
                                <Button type="primary" htmlType="submit" >
                                    Save
                                </Button>
                            </Row>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            </CenteredForm>
        </PageContent>
    )

}