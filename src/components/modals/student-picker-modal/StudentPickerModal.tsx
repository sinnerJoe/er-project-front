import React, { useState, useEffect, useRef, useCallback, useMemo, ChangeEvent } from 'react';
import { Student, User } from 'shared/interfaces/User';
import { useLoadingRequest } from 'utils/hooks';
import { getStudents } from 'shared/endpoints';
import PickerModal, { PickerModalProps, StandardOverridenProps } from '../picker-modal/PickerModal';
import { Typography, Modal, Row, Col, Input, Select } from 'antd';
import moment from 'moment';
import { SERVER_DATE, SERVER_DATE_TIME } from 'shared/constants';
import { getCurrentYear } from 'utils/datetime';
import { search } from 'shared/search';
import { useDebounce } from 'use-debounce/lib';
import { sortNullable, stringSort } from 'shared/sorting';

const { Text } = Typography;

const currentYear = getCurrentYear();

const yearOptions = Array.from({ length: 5 }).map((v, index) => ({
    value: currentYear - index,
    label: currentYear - index
}));

export interface StudentPickerModalProps extends Omit<PickerModalProps<Student>, 'initialSelected' | StandardOverridenProps> {
    onOk: (user: Student) => void | Promise<unknown>,
    excluded?: Student[]
};

export default function StudentPickerModal({ onOk, visible, excluded = [], ...rest }: StudentPickerModalProps) {
    const [request, data, loading, err] = useLoadingRequest(getStudents, []);

    const [year, setYear] = useState(currentYear);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (visible) {
            request(year);
        }
    }, [visible, year]);

    const excludedIdSet = useMemo(() => new Set(excluded.map(s => s.id)), [excluded]);

    const [executedSearch] = useDebounce(searchQuery, 400);

    const studentList = useMemo(() => data.filter(s => !excludedIdSet.has(s.id)
        && search(executedSearch, [s.email, s.firstName || '', s.lastName || '', s?.group?.name || ''])
    ).sort((a, b) => sortNullable(a?.group?.name, b?.group?.name, stringSort, false)),
        [data, excludedIdSet, executedSearch]);

    const controls = (
        <Row className="full-width mb-2" justify="space-between">
            <Col span={19}>
                <Input value={searchQuery} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} placeholder="Ion Popescu" />
            </Col>
            <Col>
                <Select options={yearOptions} value={year} onChange={setYear} />
            </Col>
        </Row>
    )

    return (
        <PickerModal
            onOk={(selected) => {
                return onOk(selected);
            }}
            data={studentList}
            initialSelected={null as Student | null}
            loading={loading}
            width={450}
            title="Add student"
            controls={controls}
            visible={visible}
            renderItem={({ id, group, firstName, lastName, createdAt }) => (
                <React.Fragment key={id}>
                    <div>{`${firstName} ${lastName}`}
                        <Text className="ml-1" type="secondary">registered on {moment(createdAt, SERVER_DATE_TIME).format(SERVER_DATE)}</Text></div>
                    <Text type="secondary">
                        {
                            group ? `Group ${group.name} from ${group.year}`
                                : 'Not assigned to any group'
                        }
                    </Text>
                </React.Fragment>
            )}
            {...rest} />
    )

}