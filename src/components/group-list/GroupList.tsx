import { Tag } from 'antd';
import { CollegeGroup } from 'interfaces/Group';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { IdIndex } from 'shared/interfaces/Id';
import AddGroupTag from './AddGroupTag';
import GroupTag from './GroupTag';

export interface GroupListProps {
    onSelect: (groupId: IdIndex) => void,
    groups: CollegeGroup[],
    selectedGroupId: IdIndex | null,
    onCreate: (name: string) => Promise<unknown>,
    onClose: (id: IdIndex) => Promise<unknown>
};

export default function GroupList({selectedGroupId, groups, onCreate, onSelect, onClose}: GroupListProps) {

    return (
        <div className="group-list">
            { groups.map((group) => (
                <GroupTag
                    className={selectedGroupId === group.id ? 'selected': ''}
                    onClose={onClose}
                    id={group.id as any}
                    key={group.id}
                    onClick={onSelect as any}
                >
                   <span className="content"> {group.name} </span>
                </GroupTag>))
            }
            <AddGroupTag onCreate={onCreate} />
        </div>
    )
}