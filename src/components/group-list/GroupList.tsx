import _ from 'lodash'
import { CollegeGroup } from 'interfaces/Group';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { IdIndex } from 'shared/interfaces/Id';
import AddGroupTag from './AddGroupTag';
import GroupTag from './GroupTag';
import { Badge, Col, Row } from 'antd';

export interface GroupListProps {
    onSelect: (groupId: IdIndex) => void,
    groups: CollegeGroup[],
    selectedGroupId: IdIndex | null,
    onCreate?: (name: string) => Promise<unknown>,
    onClose?: (id: IdIndex) => Promise<unknown>,
    className?: string,
    badgeSelector?: (group: CollegeGroup) => IdIndex | null
    badgeTitleGenerator?: (count?: IdIndex | null) => string | undefined
};

export default function GroupList({
    badgeSelector = _.constant(null),
    badgeTitleGenerator= _.constant(undefined),
    className = "",
    selectedGroupId,
    groups,
    onCreate,
    onSelect,
    onClose
}: GroupListProps) {

    return (
        <Row className={`group-list ${className}`} wrap gutter={[8,8]} align="middle" >
            { groups.map((group, index) => {
                const tag = (
                    <GroupTag
                        className={selectedGroupId === group.id ? 'selected' : ''}
                        onClose={onClose}
                        id={group.id as any}
                        onClick={onSelect as any}
                    >
                        <span className="content"> {group.name} </span>
                    </GroupTag>
                );
                const submissionCount = badgeSelector(group);
                return (
                    <Col>
                        <Badge
                            style={{zIndex: groups.length - index - 1}}
                            size="small"
                            offset={[-5, 0]}
                            title={badgeTitleGenerator(submissionCount)}
                            showZero={false}
                            key={group.id}
                            count={submissionCount}>
                            {tag}
                        </Badge>
                    </Col>
                )
            })
            }
            {onCreate && <AddGroupTag onCreate={onCreate} />}
        </Row>
    )
}