import { Button, Col, Form, Input, Row } from 'antd';
import CenteredForm from 'components/centered-form/CenteredForm';
import FormTitle from 'components/form-title/FormTitle';
import PasswordRepeat from 'components/password-repeat/PasswordRepeat';
import paths from 'paths';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { applyReset, requestReset } from 'shared/endpoints';
import { useQueryStringMaster } from 'utils/hooks';
import { hashPassword } from 'utils/password';


export default function ResetPasswordApplyPage(props: {}) {

    const [loading, setLoading] = useState(false);

    const {id} = useQueryStringMaster();

    const onSubmit = (data: any) => {
        setLoading(true);
        applyReset(id, hashPassword(data.password), () => setLoading(false));
    }

    return (
        <CenteredForm>
            <FormTitle>
                Change your password
            </FormTitle>
            <Form onFinish={onSubmit} layout="vertical" className="full-width">
                <PasswordRepeat />
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
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </CenteredForm>
    )
}