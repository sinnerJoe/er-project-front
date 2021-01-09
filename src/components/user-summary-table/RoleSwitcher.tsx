import { LoadingOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import React, {useState, useEffect, useRef, useCallback, useMemo, memo} from 'react';
import { setUserRole } from 'shared/endpoints';
import { IdIndex } from 'shared/interfaces/Id';
import { Role } from 'shared/interfaces/Role';
import { useLoadingRequest } from 'utils/hooks';

const {Link} = Typography;

const roleToLabel = (role: Role) => {
    switch(role) {
        case Role.Admin: return "Admin";
        case Role.Teacher: return "Professor";
        case Role.Student: return "Student";
        default: return "Data error";
    }
}

export interface RoleSwitcherProps {
    role: Role,
    userId: IdIndex,
    onChange: () => void
};

function RoleSwitcher(props: RoleSwitcherProps) {
    const roleLabel = roleToLabel(props.role);

    const otherRole = props.role === Role.Student ? Role.Teacher : Role.Student;

    const [request, data, loading, err] = useLoadingRequest(setUserRole, null);

    return (
        <Link onClick={() => request(props.userId, otherRole).then(props.onChange)}>
            {!loading ? `${roleLabel} (Change to ${roleToLabel(otherRole)})`
                      : <React.Fragment>
                            Changing
                            <LoadingOutlined />
                          </React.Fragment>
            }
        </Link>
    )
}

export default memo(RoleSwitcher);