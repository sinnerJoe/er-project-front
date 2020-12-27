import { Input, Row, Space, Typography, Form, Button, Col, Alert } from 'antd'
import _ from 'lodash';
import Password from 'antd/lib/input/Password';
import CenteredForm from 'components/centered-form/CenteredForm'
import FormTitle from 'components/form-title/FormTitle';
import paths from 'paths';
import React from 'react'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { registerUser } from 'shared/endpoints';
import { composableLabels, labels } from 'shared/strings';
import { useLoadingRequest } from 'utils/hooks';
import { hashPassword} from 'utils/password';
import withRequestedUser from 'utils/withRequestedUser';
import EmptyPage from 'pages/empty-page/EmptyPage';
import GroupSelect from './GroupSelect';
import PasswordRepeat from 'components/password-repeat/PasswordRepeat';
const { Text, Title } = Typography;

function RegisterPage(props: any) {
    const [form] = Form.useForm();
    const history = useHistory();
    const [registerRequest, response, loading, error] = useLoadingRequest<{message: string, status: string} | null>(registerUser, null);

    const onFinishFailed = () => { console.log("ERR") };

    const onSubmit = (values: any) => {
         const hash = hashPassword(values.password);
         console.log({...values, password: hash});
         registerRequest({...values, password: hash}).catch(_.noop);
    };

    return (
        <CenteredForm width={350} >
            <FormTitle>
                Registration
            </FormTitle>
            <Form onFinish={onSubmit} layout="vertical" className="full-width">
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
                    <GroupSelect />
                </Form.Item>
                <Form.Item required label='Email Address' name="email">
                    <Input type="email" placeholder="john.doe@info.uaic.ro" />
                </Form.Item>
                <PasswordRepeat />
                    <Row gutter={[10, 10]}>
                    <Col>
                    <Form.Item>
                        <Button type="primary" htmlType="submit"> 
                            Register
                        </Button>
                    </Form.Item>
                    </Col>
                    <Col>
                        <Link 
                           className="pb-0 mb-0" 
                           to={{pathname: paths.LOGIN, state: {avoidAuth: true}}}>
                            <Button type="ghost">
                                Back to login screen
                            </Button>
                        </Link>
                    </Col>
                    </Row>
                    {response !== null && <Alert
                        message={response.message}
                        type="success"
                    />}
                    {error && <Alert 
                        message={error?.message}
                        type='error'
                    />}


            </Form>
        </CenteredForm>
    )
}

export default withRequestedUser(RegisterPage, EmptyPage);