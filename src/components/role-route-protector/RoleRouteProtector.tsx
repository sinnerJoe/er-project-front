import paths from 'paths';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { IdIndex } from 'shared/interfaces/Id';
import { Role } from 'shared/interfaces/Role';
import { StoreData } from 'store';

export interface RoleRouteProtectorProps {
    roles?: Role[]
};

export default function RoleRouteProtector({roles}: RoleRouteProtectorProps) {
   const {role, id} = useSelector<StoreData, {role: Role, id: IdIndex}>(state => ({role: state.user.role, id: state.user.userId}));
   
   if(id == -1 || !roles || roles.includes(role)) {
        return null;
   }

   return <Redirect to={paths.UNAUTHORIZED} />
}