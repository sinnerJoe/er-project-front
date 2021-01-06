import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Button as ButtonPromise, Col, Divider, Popover, Row, Skeleton, Typography } from 'antd';
import PageContent from 'components/page-content/PageContent';
import YearAxis from 'components/year-axis/YearAxis';
import GroupList from 'components/group-list/GroupList';
import { useLoadingRequest, useQueryStringMaster } from 'utils/hooks';
import { copyGroupsToYear, createGroup, deleteGroup, getGroups } from 'shared/endpoints';
import { IdIndex } from 'shared/interfaces/Id';
import GroupEdit from 'components/group-edit/GroupEdit';
import { getCurrentYear } from 'utils/datetime';
import { CopyFilled, CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import TagsSkeleton from 'components/skeletons/TagsSkeleton';

const { Title, Text } = Typography;


export default function GroupsPage(props: {}) {

    const { year } = useQueryStringMaster({ year: String(getCurrentYear()) })

    const [fetch, groups, loading] = useLoadingRequest(getGroups, [], { initialLoading: true });

    const [selectedGroupId, selectGroup] = useState<IdIndex | null>(null);

    const selectedGroup = useMemo(() => groups.find(g => g.id === selectedGroupId), [selectedGroupId, groups])

    const fetchData = useCallback(() => fetch(year), [year]);

    let importPrevious = null;

    if (!loading && groups.length === 0) {
        importPrevious = <ImportDivider onCopy={fetchData} year={year} /> 
    }

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

            { loading && <TagsSkeleton />}

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
            {importPrevious}

        </PageContent>
    )
}

function ImportDivider({year, onCopy}: {year: IdIndex, onCopy: () => void}) {
    return (
            <div>
                <Divider orientation="center">
                    or
                </Divider>
                <Row justify="center">
                    <Popover
                        trigger="hover"
                        content={<div style={{ width: "300px" }}>
                            Groups, the coordinators assigned to them and the corresponding plans will be copied to {year}.
                            The students won't be copied over.
                            <p className="mt-2">
                                <Text strong>
                                    You can only use this feature if you have no groups created for {year}.
                                </Text>
                            </p>
                        </div>
                        }>
                        <span>
                            <ButtonPromise onClick={() => {
                                const promise = copyGroupsToYear(year);
                                promise.then(onCopy);
                                return promise;
                            }} icon={<CopyFilled />} size="large" type="primary">
                                Copy from {Number(year) - 1}
                            </ButtonPromise>
                        </span>
                    </Popover>
                </Row>
            </div>

    )
}