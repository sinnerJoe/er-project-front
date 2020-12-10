import React, { useCallback, useEffect, useState } from 'react'
import {Modal, Select} from 'antd'
import { Solution } from 'interfaces/Solution'
import { getSolutions } from 'actions/diagram';

type Props = {
    onChoose: (solutionId: number) => void;
    onClose: () => void;
    visible: boolean
}
export default function PickSolutionModal(props: Props) {
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [chosen, setChosen] = useState<number | null>(null);
    // const [visible, setVisible] = useState(props.visible);

    useEffect(() => {
        getSolutions().then(res => setSolutions(res))
    }, []);

    const handleOk = useCallback(() => {
        if(chosen) {
            props.onChoose(chosen);
            // setVisible(false);
            props.onClose();
        }
    }, [props.onChoose, chosen]);

    const handleCancel = useCallback(() => {
        // setVisible(false);
        props.onClose();
    }, [props.onClose])


    return (
        <Modal
          title="Submit solution"
          okText="Submit"
          visible={props.visible}
          onOk={handleOk}
          onCancel={handleCancel}
          okButtonProps={{disabled: !chosen}}
          closable
        >
            <Select 
                onChange={(id: number, ...rest) => { setChosen(id); }}
                style={{width: "100%"}}
            >
                {
                    solutions.map(s => (
                        <Select.Option key={s.id} value={s.id}>{s.title}</Select.Option>
                    ))
                }

            </Select>
        </Modal>
    )
}