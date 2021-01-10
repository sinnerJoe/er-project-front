import { Alert, Button, Form, Input, Row } from 'antd';
import CenteredForm from 'components/centered-form/CenteredForm';
import PageContent from 'components/page-content/PageContent';
import PasswordRepeat from 'components/password-repeat/PasswordRepeat';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { changePassword } from 'shared/endpoints';
import {hashPassword} from 'utils/password';
import { useLoadingRequest } from 'utils/hooks';
import { SaveFilled } from '@ant-design/icons';

export default function ChangePasswordPage(props: any) {

    const [request, data, loading, err] = useLoadingRequest(changePassword, null);
    const [sent, setSent] = useState(false);
    const onSubmit = (values: any) => {
        setSent(false);
        request(hashPassword(values.oldPassword), hashPassword(values.password))
        .catch(() => {}).then(() => setSent(true));
    }
    return (
        <PageContent minWidth={360}>
            <CenteredForm width={350}>
                <Form onFinish={onSubmit} layout="vertical">
                    <Form.Item
                        required
                        label="Old password"
                        name="oldPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please write your old password.',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <PasswordRepeat />
                    <Form.Item>
                        <Row justify="end">
                            <Button icon={<SaveFilled />} loading={loading} htmlType="submit" type="primary">
                                Save
                        </Button>
                        </Row>
                    </Form.Item>
                    {err && <Alert type="error" message={err.message}/> }
                    {sent && !err && <Alert type="success" message="Password successfully changed." />}
                </Form>
            </CenteredForm>
        </PageContent>
    )
}