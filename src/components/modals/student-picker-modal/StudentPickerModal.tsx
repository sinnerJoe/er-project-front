import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { Student, User } from 'shared/interfaces/User';
import { useLoadingRequest } from 'utils/hooks';
import {getStudents} from 'shared/endpoints';
import PickerModal, { PickerModalProps, StandardOverridenProps } from '../picker-modal/PickerModal';
import { Typography, Modal } from 'antd';
import moment from 'antd/node_modules/moment';
import { SERVER_DATE, SERVER_DATE_TIME } from 'shared/constants';
import { openConfirmPromise } from 'utils/modals';
import { ExclamationOutlined } from '@ant-design/icons';

const {Text} = Typography;

export interface StudentPickerModalProps extends Omit<PickerModalProps<Student>, 'initialSelected' | StandardOverridenProps> {
   onOk: (user: Student) => void | Promise<unknown>,
   excluded?: Student[]
};

export default function StudentPickerModal({onOk, visible, excluded=[], ...rest}: StudentPickerModalProps) {
   const [request, data, loading, err] = useLoadingRequest(getStudents, []);

   useEffect(() => {
       if(visible) {
           request();
       }
   }, [visible]);

   const excludedIdSet = useMemo(() => new Set(excluded.map(s => s.id)), [excluded]);

   const studentList = useMemo(() => data.filter(s => !excludedIdSet.has(s.id)), [data, excludedIdSet]);

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
            visible={visible}
            renderItem={({id, group, firstName, lastName, createdAt}) => (
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