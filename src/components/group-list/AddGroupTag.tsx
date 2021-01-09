import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { Input, Tag } from 'antd';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import './AddGroupTag.scss';
import EditableField from 'components/editable-field/EditableField';

export interface AddGroupTagProps {
    onCreate: (name: string) => Promise<unknown>,
};

export default function AddGroupTag({ onCreate }: AddGroupTagProps) {

    return (
        <EditableField initialValue="" placeholder="A1" noStyle onSave={onCreate}>
            <Tag
                className="group-tag">
                <div className="content">
                    <PlusOutlined /> New Group
                </div>
            </Tag>
        </EditableField>
        )
}