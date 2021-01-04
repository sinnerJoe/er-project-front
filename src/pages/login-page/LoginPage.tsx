import React, { useState } from 'react'
import _ from 'lodash';
import { Input, Row, Space, Typography, Form, Button, Col, Alert } from 'antd'
import Password from 'antd/lib/input/Password';
import CenteredForm from 'components/centered-form/CenteredForm'
import FormTitle from 'components/form-title/FormTitle';
import { Link, useHistory } from 'react-router-dom';
import paths from 'paths';
import { authenticate } from 'shared/endpoints';
import { useLoadingRequest } from 'utils/hooks';
import { hashPassword } from 'utils/password';
import { fetchCurrentUser } from 'store/slices/user';
import store from 'store';
import withRequestedUser from 'utils/withRequestedUser';
import EmptyPage from 'pages/empty-page/EmptyPage';
import { notify } from 'shared/error-handlers';

const loginRequest = async (email: string, password: string) => {
    const response = await authenticate(email, hashPassword(password));
    // if(response.data.status === 'success') {
    //     await store.dispatch(fetchCurrentUser());
    // }
    return response;
}

function LoginPage(props: any) {
    const [form] = Form.useForm();
    const [authRequest, response, loading] = useLoadingRequest<{message: string, status: string} | null>(loginRequest, null);
    const history = useHistory();
    const onFinish = ({email, password}: any) => {
        authRequest(email, password).then((response) => {
            if(response.data.data) {
                notify({type: "success", message: "Authentication succeeded"})(response);
                history.replace('');
            } else {
                notify({type: "error", message: "Authentication faied"})(response);
            }
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
                        <Link to={{pathname: paths.REGISTER, state: {avoidAuth: true}}}>
                            <Button  type="ghost">
                                Sign Up
                            </Button>
                        </Link>
                    </Col>
                    <Col>
                        <Link to={{pathname: paths.FORGOT_PASSWORD, state: {avoidAuth: true}}}>
                            <Button type="link">
                                Forgot password?
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

export default withRequestedUser(LoginPage, EmptyPage);