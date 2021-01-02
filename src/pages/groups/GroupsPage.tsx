import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Col, Row, Skeleton, Typography } from 'antd';
import PageContent from 'components/page-content/PageContent';
import YearAxis from 'components/year-axis/YearAxis';
import GroupList from 'components/group-list/GroupList';
import { useLoadingRequest, useQueryStringMaster } from 'utils/hooks';
import { createGroup, deleteGroup, getGroups } from 'shared/endpoints';
import { CollegeGroup } from 'interfaces/Group';
import { IdIndex } from 'shared/interfaces/Id';
import GroupEdit from 'components/group-edit/GroupEdit';
import { getCurrentYear } from 'utils/datetime';
import { LoadingOutlined } from '@ant-design/icons';
import TagsSkeleton from 'components/skeletons/TagsSkeleton';

const { Title } = Typography;


export default function GroupsPage(props: {}) {

    const { year } = useQueryStringMaster({ year: String(getCurrentYear()) })

    const [fetch, groups, loading] = useLoadingRequest(getGroups, [], {initialLoading: true});

    const [selectedGroupId, selectGroup] = useState<IdIndex | null>(null);

    const selectedGroup = useMemo(() => groups.find(g => g.id === selectedGroupId), [selectedGroupId, groups])

    const fetchData = useCallback(() => fetch(year), [year]);

    useEffect(() => {
        fetchData();
    }, [year])

    return (
        <PageContent>
            <YearAxis onChange={_.noop} />
            <Title className="mt-10" level={4}>
                Groups {loading && <LoadingOutlined />}
            </Title>
            { !loading && <GroupList
                selectedGroupId={selectedGroupId}
                onSelect={id => selectGroup(id)}
                onClose={id => deleteGroup(id).then(() => fetch(year))}
                groups={groups}
                onCreate={(name) => createGroup(name, year).then(() => fetch(year))}
            />
            }

            { loading && <TagsSkeleton /> }

            {selectedGroup &&
                <React.Fragment>
                    <Title className="mt-8" level={4}>
                        Group {selectedGroup.name}
                    </Title>
                    <GroupEdit
                        onChange={fetchData}
                        {...selectedGroup}
                    />

                </React.Fragment>
            }

        </PageContent>
    )
}