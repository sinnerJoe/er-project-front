import { Input, Row, Space, Typography, Form, Button, Col } from 'antd'
import { useForm } from 'antd/lib/form/Form';
import Password from 'antd/lib/input/Password';
import CenteredForm from 'components/centered-form/CenteredForm'
import FormTitle from 'components/form-title/FormTitle';
import paths from 'paths';
import React from 'react'
import { Link } from 'react-router-dom';
import { composableLabels, labels } from 'shared/strings';
const { Text, Title } = Typography;
export default function RegisterPage(props: any) {
    const [form] = Form.useForm();
    const onFinish = () => { console.log("FIN") };

    const onFinishFailed = () => { console.log("ERR") };

    return (
        <CenteredForm width={350} >
            <FormTitle>
                Registration
            </FormTitle>
            <Form onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical" className="full-width">
                <Form.Item
                    rules={[{ required: true, message: composableLabels.fieldRequired(labels.firstName) }]}
                    required
                    label='First Name'
                    name="firstName">
                    <Input placeholder="John" />
                </Form.Item>
                <Form.Item required label='Last Name' name="lastName">
                    <Input placeholder="Doe" />
                </Form.Item>
                <Form.Item required label='Group' name="group">
                    <Input placeholder="A3" />
                </Form.Item>
                <Form.Item required label='Email Address' name="email">
                    <Input type="email" placeholder="john.doe@info.uaic.ro" />
                </Form.Item>
                <Form.Item required label='Password' name="password">
                    <Password placeholder="***********" />
                </Form.Item>
                <Form.Item required label='Repeat Password' name="passwordAgain">
                    <Password placeholder="***********" />
                </Form.Item>
                    <Row gutter={[10, 10]}>
                    <Col>
                    <Form.Item>
                        <Button type="primary" htmlType="submit"> 
                            Register
                        </Button>
                    </Form.Item>
                    </Col>
                    <Col>
                        <Link to={paths.LOGIN} className="pb-0 mb-0">
                            <Button type="ghost">
                                Back to login screen
                            </Button>
                        </Link>
                    </Col>
                    </Row>


            </Form>
        </CenteredForm>
    )
}
