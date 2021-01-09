import { Select } from 'antd';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { getShallowGroups } from 'shared/endpoints';
import { getCurrentYear } from 'utils/datetime';
import { useLoadingRequest } from 'utils/hooks';

export default function GroupSelect({value, ...rest}: React.ComponentProps<typeof Select>) {
    const [request, groups, loading] = useLoadingRequest(getShallowGroups, [], {initialLoading: true});

    useEffect(() => {
        request(getCurrentYear());
    }, []);

    const options = useMemo(() => {
        const list = groups.map(g => ({value: g.id, label: g.name}))
        return list;
    }, [groups]);

    return (
        <Select placeholder="Select your group" options={options} loading={loading} value={value} {...rest}/>
    )
    
}