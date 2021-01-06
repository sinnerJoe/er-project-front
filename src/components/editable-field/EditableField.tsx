import { CheckOutlined, CloseOutlined, EditFilled, EditOutlined } from '@ant-design/icons';
import { current } from '@reduxjs/toolkit';
import { Button, Col, Input, Row, Form } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import PromiseButton from 'components/promise-button/PromiseButton';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { emptySpace } from 'shared/validators';

import './EditableField.scss';

export interface EditableFieldProps extends React.ComponentProps<typeof Input> {
    children: React.ReactElement,
    onSave: (value: string) => Promise<unknown>,
    initialValue: string,
    noStyle?: boolean
};

export default function EditableField({ children, initialValue, onSave, noStyle=false, ...props }: EditableFieldProps) {

    const [editing, setEditing] = useState(false);

    const [loading, setLoading] = useState(false);

    const [form] = useForm();

    const inputRef = useRef<any>();

    useEffect(() => {
        if(editing && inputRef.current) {
            inputRef.current.select();
        }
    }, [editing]);

    const onSubmit = ({value}: {value: string}) => {
        if(value != initialValue) {
            setLoading(true);
            onSave(value).then(() => { setLoading(false); setEditing(false) } );
        } else {
            setEditing(false);
        }
    }

    if (!editing) {
        if(noStyle) {
            return React.cloneElement(children, {onClick: () => setEditing(true)});
        }
        return (
            <span onClick={() => setEditing(true)} className="editable-aura cursor-pointer">
                <span className="inline-flex">
                    {children} <EditOutlined className="icon ml-2" />
                </span>
            </span>
        )
    }


    return (
        <Form className="d-inline-block" onFinish={onSubmit} form={form} initialValues={{ value: initialValue }}>
            <Row gutter={[4, 4]} className="inline-flex mt-0 mb-0 ml-0 mr-0" wrap={false} >
                <Col className="pt-0 pb-0 hide-error">
                    <Form.Item className="mb-0" name="value" rules={[{validator: emptySpace}]}>
                        <Input
                            ref={inputRef}
                            disabled={loading}
                            {...props}
                        />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item className="mb-0">
                            <Button 
                            htmlType="submit" 
                            type="ghost" 
                            loading={loading}
                            icon={<CheckOutlined />} />
                    </Form.Item>
                </Col>
                <Col>
                    <Button 
                        disabled={loading} 
                        onClick={() => {
                            setEditing(false);
                            form.resetFields(['value']);
                        }} 
                        type="ghost" 
                        danger 
                        icon={<CloseOutlined />} />
                </Col>
            </Row>
        </Form>
    )
}