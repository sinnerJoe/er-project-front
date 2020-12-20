import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {Button} from 'antd';
import _ from 'lodash';

export interface PromiseButtonProps extends Omit<React.ComponentProps<typeof Button>, 'onClick' | 'loading'> {
   onClick: () => void | Promise<unknown> 
};

export default function PromiseButton({onClick, ...rest}: PromiseButtonProps) {
    const [loading, setLoading] = useState(false);

    return (
        <Button 
            {...rest}
            onClick={() => {
                const potentialPromise = onClick();
                if(potentialPromise) {
                    setLoading(true);
                    potentialPromise.catch(_.noop).then(() => setLoading(false));
                }
            }}
            loading={loading} 
        />
    )
}