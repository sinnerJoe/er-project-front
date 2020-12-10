import { fromPairs } from 'lodash'
import React from 'react'
import {Select} from 'antd';

export function BackendSelect (props: any) {
    return ( 
        <Select
        {...props}/>
    )
}