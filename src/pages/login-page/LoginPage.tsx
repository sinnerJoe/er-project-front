import React from 'react'
import { Input, Row, Space, Typography, Form, Button, Col } from 'antd'
import { useForm } from 'antd/lib/form/Form';
import Password from 'antd/lib/input/Password';
import CenteredForm from 'components/centered-form/CenteredForm'
import FormTitle from 'components/form-title/FormTitle';
import { Link } from 'react-router-dom';
import paths from 'paths';

export default function LoginPage(props: any) {
    const [form] = Form.useForm();
    const onFinish = () => {console.log("FIN")};

    const onFinishFailed = () => {console.log("ERR")};

    return (
        <CenteredForm>
            <FormTitle>
                Authentication
            </FormTitle>
            <Form onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical" className="full-width">
                  
                    <Form.Item label='Email Address' name="email">
                        <Input type="email" placeholder="john.doe@info.uaic.ro" />
                    </Form.Item>
                    <Form.Item label='Password' name="password">
                        <Password placeholder="***********" />
                    </Form.Item>
                    <Row gutter={[10, 10]}>
                    <Col>
                    <Form.Item>
                        <Button type="primary" htmlType="submit"> 
                            Sign In
                        </Button>
                    </Form.Item>
                    </Col>
                    <Col>
                        <Link to={paths.REGISTER}>
                            <Button type="ghost">
                                Sign Up
                            </Button>
                        </Link>
                    </Col>
                    </Row>

            </Form>
        </CenteredForm>
    )
}
