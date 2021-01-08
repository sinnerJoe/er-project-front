import { Button, Result } from 'antd';
import CenteredForm from 'components/centered-form/CenteredForm';
import paths from 'paths';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { Link } from 'react-router-dom';

export interface UnauthorizedProps {
    
};

export default function Unauthorized(props: UnauthorizedProps) {
    
    return (
        <CenteredForm>

        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Link to={paths.MAIN_PAGE}> <Button type="primary">Back Home</Button></Link>}
            />
        </CenteredForm>
    )
}