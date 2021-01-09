import React, { useState, useEffect, useRef, useCallback, useMemo, ComponentProps } from 'react';
import { Form, Input } from 'antd';

export interface PasswordRepeatProps extends ComponentProps<typeof Form.Item> {

};

export default function PasswordRepeat(props: PasswordRepeatProps) {

    return (
        <React.Fragment>
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: 'Please input your password.',
                    },
                ]}
                required label="Password" name="password" {...props}>
                <Input.Password />
            </Form.Item>
            <Form.Item
                hasFeedback
                required
                label="Repeat Password"
                dependencies={['password']}
                name="confirm"
                rules={[
                    {
                        required: true,
                        message: "You have to write the password again."
                    },
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                            console.log(getFieldValue("password"))
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('The two passwords that you entered do not match.')
                        }, 
                    })
                ]}
            >
                <Input.Password />
            </Form.Item>
        </React.Fragment>
    )
}