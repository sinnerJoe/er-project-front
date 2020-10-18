import React, { useState } from 'react'
import {Popover} from 'antd';
import MarkView from './MarkView';
import MarkPicker from './MarkPicker';
import { postSolutionMark } from 'actions/diagram';

type Props = {
    solutionId: number,
    mark?: number,
    onChange: () => void 
}
export default function MarkInput(props: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <Popover
            visible={visible}
            content={
            <MarkPicker 
                onSubmit={(mark?: number) => {
                    postSolutionMark(props.solutionId, mark);
                    setVisible(false);
                    props.onChange();
                }} 
            mark={props.mark}/>}
            trigger="click"
            onVisibleChange={setVisible}
        >
            <MarkView mark={props.mark} className="pointer" />
        </Popover>
    )
}