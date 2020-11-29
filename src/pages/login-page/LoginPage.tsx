import React, { useState } from 'react'
import _ from 'lodash';
import { Input, Row, Space, Typography, Form, Button, Col, Alert } from 'antd'
import { useForm } from 'antd/lib/form/Form';
import Password from 'antd/lib/input/Password';
import CenteredForm from 'components/centered-form/CenteredForm'
import FormTitle from 'components/form-title/FormTitle';
import { Link, useHistory } from 'react-router-dom';
import paths from 'paths';
import { authenticate } from 'shared/endpoints';
import { useLoadingRequest } from 'utils/hooks';
import { stringify } from 'querystring';
import { hashPassword } from 'utils/password';
const { Text, Title } = Typography;

export default function LoginPage(props: any) {
    const [form] = Form.useForm();
    // const [loading, setLoading] = useState(false);
    // const [response, setResponse] = useState<{status: string, message: string} | null> (null);
    const [authRequest, response, loading] = useLoadingRequest<{message: string, status: string} | null>(authenticate, null);
    const history = useHistory();
    const onFinish = ({email, password}: any) => {
        // TODO RECEIVE USER DATA AND REDIRECT ACCORDINGLY TO THE ROLE
        authRequest(email, hashPassword(password)).then(() => {
            history.replace(paths.PROFESSOR_ASSIGNMENTS);
        })
        .catch(_.identity);
    };

    const onFinishFailed = () => {console.log("ERR")};

    return (
        <CenteredForm>
            <FormTitle>
                Authentication
            </FormTitle>
            <Form onFinish={onFinish} form={form} onFinishFailed={onFinishFailed} layout="vertical" className="full-width">
                  
                    <Form.Item label='Email Address' name="email">
                        <Input type="email" placeholder="john.doe@info.uaic.ro" />
                    </Form.Item>
                    <Form.Item label='Password' name="password">
                        <Password placeholder="***********" />
                    </Form.Item>
                    <Row gutter={[10, 10]}>
                    <Col>
                    <Form.Item>
                        <Button loading={loading} type="primary" htmlType="submit"> 
                            Sign In
                        </Button>
                    </Form.Item>
                    </Col>
                    <Col>
                        <Link to={paths.REGISTER}>
                            <Button  type="ghost">
                                Sign Up
                            </Button>
                        </Link>
                    </Col>
                    </Row>
                    {response && <Alert
                        message={response.message}
                        // description="Further details about the context of this alert."
                        type={response.status === 'success' ? "success" : "error"}
                    />}

            </Form>
        </CenteredForm>
    )
}
