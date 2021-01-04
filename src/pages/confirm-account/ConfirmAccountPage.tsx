import FullScreenLoader from 'components/full-screen-loader/FullScreenLoader';
import _ from 'lodash'
import paths from 'paths';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { Link } from 'react-router-dom';
import { confirmAccount } from 'shared/endpoints';
import { useLoadingRequest, useQueryStringMaster } from 'utils/hooks';
import CenteredForm from 'components/centered-form/CenteredForm';
import { Button, Result } from 'antd';

export default function ConfirmAccountPage(props: {}) {
    
    const {id} = useQueryStringMaster();

    const [request, data, loading, err] = useLoadingRequest(confirmAccount, null, {initialLoading: true});

    useEffect(() => {
        if(id) {
            request(id).catch(_.noop);
        }
    }, [id]);

    if(err) {
        return <Result
            status="404"
            title="404"
            subTitle="It seems that this link was already used"
            extra={<Link to={paths.LOGIN}><Button type="primary">To login page</Button></Link>}
        />
    }

    if(!loading) {
        return <Result
            status="success"
            title="You successfully activated your account"
            extra={<Link to={paths.LOGIN}><Button type="primary">To login page</Button></Link>}
        />
    }
    
    return <FullScreenLoader tip="Confirming your email address, please wait." />
}