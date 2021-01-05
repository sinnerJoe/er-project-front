import { Input, Row, Space, Typography, Form, Button, Col, Alert } from 'antd'
import _ from 'lodash';
import CenteredForm from 'components/centered-form/CenteredForm'
import FormTitle from 'components/form-title/FormTitle';
import paths from 'paths';
import React, { useState } from 'react'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { registerUser } from 'shared/endpoints';
import { composableLabels, labels } from 'shared/strings';
import { hashPassword } from 'utils/password';
import withRequestedUser from 'utils/withRequestedUser';
import EmptyPage from 'pages/empty-page/EmptyPage';
import GroupSelect from './GroupSelect';
import PasswordRepeat from 'components/password-repeat/PasswordRepeat';
import { emptySpace } from 'shared/validators';

function RegisterPage(props: any) {

    const [loading, setLoading] = useState(false);

    const onSubmit = (values: any) => {
        const hash = hashPassword(values.password);
        setLoading(true);
        registerUser({ ...values, password: hash }, () => setLoading(false));
    };

    return (
        <CenteredForm width={350} >
            <FormTitle>
                Registration
            </FormTitle>
            <Form onFinish={onSubmit} layout="vertical" className="full-width">
                <Form.Item
                    rules={[{
                        validator: emptySpace,
                        message: composableLabels.fieldRequired(labels.firstName)
                    }]}
                    required
                    label='First Name'
                    name="firstName">
                    <Input placeholder="John" />
                </Form.Item>
                <Form.Item required

                    rules={[{
                        validator: emptySpace,
                        message: composableLabels.fieldRequired(labels.lastName)
                    }]}
                    label='Last Name' name="lastName">
                    <Input placeholder="Doe" />
                </Form.Item>
                <Form.Item required label='Group' name="group">
                    <GroupSelect />
                </Form.Item>
                <Form.Item required label='Email Address' name="email">
                    <Input type="email" placeholder="john.doe@info.uaic.ro" />
                </Form.Item>
                <PasswordRepeat />
                <Row justify="end" gutter={[10, 10]}>
                    <Col>
                        <Link
                            className="pb-0 mb-0"
                            to={{ pathname: paths.LOGIN, state: { avoidAuth: true } }}>
                            <Button type="ghost">
                                Back to login screen
                            </Button>
                        </Link>
                    </Col>
                    <Col>
                        <Form.Item>
                            <Button loading={loading} type="primary" htmlType="submit">
                                Register
                        </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </CenteredForm>
    )
}

export default withRequestedUser(RegisterPage, EmptyPage);