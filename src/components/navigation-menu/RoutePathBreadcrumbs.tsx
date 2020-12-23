import _ from 'lodash';
import { Breadcrumb, Typography } from 'antd';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import routes from 'routes';
import { StoreData } from 'store';

import './RoutePathBreadcrumbs.scss';
import { Link, useHistory } from 'react-router-dom';
import { DoubleRightOutlined } from '@ant-design/icons';
import { useQueryStringMaster } from 'utils/hooks';

const { Item } = Breadcrumb

const { Title } = Typography;

export default function RoutePathBreadcrumbs(props: {}) {
    const routeIndex = useSelector<StoreData, number | undefined>(state => state.header.routeIndex);

    const routeSteps = !_.isNil(routeIndex) ? routes[routeIndex].routeSteps : null;

    const history = useHistory();

    const queryMaster = useQueryStringMaster();

    return useMemo(() => _.isNil(routeSteps) ? null : (
        <Breadcrumb separator={<DoubleRightOutlined />} className="route-path-breadcrumbs">
            {routeSteps.map(({ to, title, icon }, index) => {

                let content = (
                    <React.Fragment>
                        <Title
                            className="path-label mt-0 mb-0" level={4}>
                                {icon}{title}
                        </Title>
                    </React.Fragment>
                )

                const lastEntry = routeSteps.length - 1 === index;
                const reload =  lastEntry ? () => history.go(0) : _.noop;

                if (to && !lastEntry) {
                    content = <Link to={to}> {content} </Link>
                }
                
                return (
                    <Item key={index} onClick={reload} className="route-crumb">
                        {content}
                    </Item>
                )
            })}
        </Breadcrumb>
    ), [routeSteps]);
}