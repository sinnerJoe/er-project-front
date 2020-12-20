import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { Input, Tag } from 'antd';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import './AddGroupTag.scss';

export interface AddGroupTagProps {
    onCreate: (name: string) => Promise<unknown>,
};

export default function AddGroupTag({ onCreate }: AddGroupTagProps) {

    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const input = (
        

            <Input
                size="small"
                value={inputValue}
                className="group-tag-input"
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => setInputVisible(false)}
                autoFocus
                onPressEnter={() => {
                    setLoading(true);
                    setInputVisible(false);
                    onCreate(inputValue).catch(_.noop).then(v => setLoading(false));
                    setInputValue('');
                }}
                required
            />
        
    );
    return (
        <Tag
            className="group-tag"
            onClick={() => setInputVisible(true)} icon={loading ? <LoadingOutlined /> : <PlusOutlined />}>
            <div className="content">
            {
                inputVisible ? input : 'New Group'
            }
            </div>
        </Tag>)
}