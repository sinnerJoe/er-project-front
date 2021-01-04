import { SaveFilled } from '@ant-design/icons';
import {Alert, Button, Divider, Form, Input, Row, Typography} from 'antd'
import CenteredForm from 'components/centered-form/CenteredForm';
import PageContent from 'components/page-content/PageContent';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { changeName, fetchOwnData } from 'shared/endpoints';
import { useLoadingRequest } from 'utils/hooks';
import DeleteUserButton from './DeleteUserButton';

const {Text} = Typography;
export interface EditProfilePageProps {

};

export default function EditProfilePage(props: EditProfilePageProps) {

    const [sent, setSent] = useState(false);
    const [submitName, rs, loadingName, err] = useLoadingRequest(changeName, null);

    const onSubmit = (values: any) => {
        setSent(false);
        submitName(values.firstName, values.lastName).catch(() => {}).then(() => setSent(true));
    }

    const [fetchData, data, loading, getErr] = useLoadingRequest(fetchOwnData, null, {initialLoading: true});

    useEffect(() => {
        fetchData();
    }, []);

    if(data === null) {
        return false;
    }

    return (
        <PageContent>
            <CenteredForm width={350} height={300}>
                <Form initialValues={data} onFinish={onSubmit} layout="vertical">
                    <Form.Item label="Group">
                        <Input disabled value={data.group?.name || 'No group'}/>
                    </Form.Item>
                    <Form.Item
                        label="First Name"
                        name="firstName"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Row justify="end">
                            <Button icon={<SaveFilled />} loading={loadingName} htmlType="submit" type="primary">
                                Save
                        </Button>
                        </Row>
                    </Form.Item>
                    {sent && err && <Alert type="error" message={err.message} />}
                    {sent && !err && <Alert type="success" message="Name successfully changed." />}
                </Form>
                <Divider>
                    or
                </Divider>
                <DeleteUserButton />
            </CenteredForm>
        </PageContent>
    )
}