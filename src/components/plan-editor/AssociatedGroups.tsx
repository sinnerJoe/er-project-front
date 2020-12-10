import _, { add } from 'lodash';
import { Select } from 'antd';
import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import { fetchAllGroups } from 'shared/endpoints';
import { useLoadingRequest } from 'utils/hooks';

export enum ChangeType {
    Remove,
    Add
}

export interface AssociatedGroupsProps {
    value?: number[],
    onChange?: (value: number[]) => void,
    existingGroups?: number[]
};

const {Option} = Select;

export default function AssociatedGroups({value = [], onChange=_.noop, existingGroups=[]}: AssociatedGroupsProps) {

    const [request, data, loading] = useLoadingRequest<{id: number, name: string}[]>(fetchAllGroups, []);

    useEffect(() => {
        request();
    })

    return (
        <Select 
            loading={loading}
            mode="multiple"
            defaultValue={existingGroups}
            onChange = {(newVal) => {
                onChange(newVal);
            }}
            value={value}
        >
            {data.map(({id, name}) => (
                <Option value={id} key={id}>
                    {name}
                </Option>
            ))}
        </Select>
    )
}

export function detectChanges(oldValues: number[], newValues: number[]) {
    const added = new Set();
    const removed = new Set();

    for(const oldVal of oldValues) {
        if(!newValues.includes(oldVal)) {
            removed.add(oldVal);
        }
    }

    for(const newVal of newValues) {
        if(!oldValues.includes(newVal)) {
            added.add(newVal);
        }
    }

    const remArr = Array.from(removed).map(v => ( {id: v, type: ChangeType.Remove} ));
    const addArr = Array.from(added).map(v => ( {id: v, type: ChangeType.Add} ));

    return [...remArr, addArr];
}