import { Input, Row, Space, Typography, Form, Button, Col, Alert } from 'antd'
import _ from 'lodash';
import { useForm } from 'antd/lib/form/Form';
import Password from 'antd/lib/input/Password';
import CenteredForm from 'components/centered-form/CenteredForm'
import FormTitle from 'components/form-title/FormTitle';
import paths from 'paths';
import React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import { registerUser } from 'shared/endpoints';
import { composableLabels, labels } from 'shared/strings';
import { useLoadingRequest } from 'utils/hooks';
import { hashPassword} from 'utils/password';
const { Text, Title } = Typography;
export default function RegisterPage(props: any) {
    const [form] = Form.useForm();
    const history = useHistory();
    const [registerRequest, response, loading] = useLoadingRequest<{message: string, status: string} | null>(registerUser, null);

    const onFinishFailed = () => { console.log("ERR") };

    const onSubmit = (values: any) => {
         const hash = hashPassword(values.password);
         registerRequest({...values, password: hash}).catch(_.noop);
    };

    return (
        <CenteredForm width={350} >
            <FormTitle>
                Registration
            </FormTitle>
            <Form onFinish={onSubmit} onFinishFailed={onFinishFailed} layout="vertical" className="full-width">
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
                    {response !== null && <Alert
                        message={response.message}
                        // description="Further details about the context of this alert."
                        type={response.status === 'success' ? "success" : "error"}
                    />}


            </Form>
        </CenteredForm>
    )
}
