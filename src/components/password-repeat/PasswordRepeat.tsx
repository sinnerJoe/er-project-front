import React, { useState, useEffect, useRef, useCallback, useMemo, ComponentProps } from 'react';
import { Form, Input } from 'antd';

export interface PasswordRepeatProps extends ComponentProps<typeof Form.Item> { };

const PASSWORD_COMPLEXITY = 'The password should contain both uppercase and lowercase letters as well as digits.'

export default function PasswordRepeat(props: PasswordRepeatProps) {

    return (
        <React.Fragment>
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: 'Please input your password.',
                    },
                    {
                        min: 8,
                        message: 'The password should be at least 8 characters long.' 
                    },
                    {
                        validator(rule, value: string) {
                            if(!value.match(/[a-z]/) || !value.match(/[A-Z]/) || !value.match(/[0-9]/)) {
                                return Promise.reject();
                            }
                            return Promise.resolve()
                        },
                        message: PASSWORD_COMPLEXITY
                    }
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