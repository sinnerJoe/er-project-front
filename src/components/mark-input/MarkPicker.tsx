import { Button, Col, Row } from 'antd';
import React, { memo, useState } from 'react'
import MarkView from './MarkView';

type Props = {
    mark?: number,
    onSubmit: (mark?: number) => void
}

const MARK_CLASS = "pointer"
const MARK_UNCHANGED = "The selected mark is already set."

function MarkPicker(props: Props) {
    const inputMark = props.mark || 0;
    const [mark, setMark] = useState(inputMark);

    return (
        <div className="mark-picker">
            <Row className="full-width" justify="space-around">
                {new Array(5).fill(0).map((v, k) => (
                    <Col key={k}>
                        <MarkView
                            className={`${MARK_CLASS} ${k + 1 == mark ? 'selected' : ''}`}
                            mark={k + 1}
                            onClick={() => setMark(k + 1)} />
                    </Col>
                ))}
            </Row>
            <Row className="full-width mt-2" justify="space-around">

                {new Array(5).fill(0).map((v, k) => (
                    <Col key={k}>
                        <MarkView
                            className={`${MARK_CLASS} ${k + 6 == mark ? 'selected' : ''}`}
                            mark={k + 6}
                            onClick={() => setMark(k + 6)} />
                    </Col>
                ))
                }
            </Row>
            <Row justify="end" className="mt-3">
                <Col>
                    {!!inputMark && (
                        <Button
                            onClick={() => props.onSubmit()}
                            type="primary"
                            className="mr-1"
                            danger>
                            Clear
                        </Button>
                    )
                    }
                    <Button
                        title={inputMark === mark ? MARK_UNCHANGED : undefined}
                        disabled={inputMark === mark}
                        onClick={() => props.onSubmit(mark)}>
                        Change
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default React.memo(MarkPicker)

