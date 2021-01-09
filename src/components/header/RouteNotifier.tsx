import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {displayRoute} from 'store/slices/header'

export interface RouteNotifierProps {
    routeIndex?: number
};

export default function RouteNotifier(props: RouteNotifierProps) {
    const dispatch = useDispatch();
    const location = useLocation();
    useEffect(() => {
        dispatch(displayRoute(props.routeIndex));
    }, [location.pathname]);

    return null;
}