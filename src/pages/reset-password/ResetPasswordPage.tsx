import { Button, Col, Form, Input, Row } from 'antd';
import CenteredForm from 'components/centered-form/CenteredForm';
import FormTitle from 'components/form-title/FormTitle';
import paths from 'paths';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { requestReset } from 'shared/endpoints';

export interface ResetPasswordPageProps {

};

export default function ResetPasswordPage(props: ResetPasswordPageProps) {

    const [loading, setLoading] = useState(false);

    const onSubmit = (data: any) => {
        setLoading(true)
        requestReset(data.email, () => setLoading(false));
    }

    return (
        <CenteredForm>
            <FormTitle>
                Request Reset Password
            </FormTitle>
            <Form onFinish={onSubmit} layout="vertical" className="full-width">
                <Form.Item name='email' rules={[
                    {
                        type: 'email',
                        message: "Write a valid email address."
                    }
                ]}>
                    <Input type="email" placeholder="john.doe@info.uaic.ro" />
                </Form.Item>
                <Row justify="end" gutter={[10, 10]}>
                    <Col>
                        <Link to={{ pathname: paths.LOGIN, state: { avoidAuth: true } }}>
                            <Button type="ghost">
                                Back to Login
                            </Button>
                        </Link>
                    </Col>

                    <Col>
                        <Form.Item noStyle>
                            <Button loading={loading} type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </CenteredForm>
    )
}