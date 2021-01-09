import { Empty } from 'antd';
import CenteredForm from 'components/centered-form/CenteredForm';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';

export interface NoDataProps extends React.ComponentProps<typeof Empty>{
    
};

export default function NoData(props: NoDataProps) {
    
    return (
        <CenteredForm>
            <Empty {...props} />
        </CenteredForm>
    )
}