import { Button, Col, Row } from 'antd';
import PromiseButton from 'components/promise-button/PromiseButton';
import React, { memo, useState } from 'react'
import { IdIndex } from 'shared/interfaces/Id';
import { useLoadingRequest } from 'utils/hooks';
import MarkView from './MarkView';

type Props = {
    mark?: IdIndex,
    onSubmit: (mark: IdIndex | null) => void
}

const MARK_CLASS = "pointer"
const MARK_UNCHANGED = "The selected mark is already set."

function MarkPicker(props: Props) {
    const inputMark = props.mark || 0;
    const [mark, setMark] = useState(inputMark);
    const [loading, setLoading] = useState(false);

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
                        <PromiseButton
                            onClick={() => props.onSubmit(null)}
                            type="primary"
                            className="mr-1"
                            danger>
                            Clear
                        </PromiseButton>
                    )
                    }
                    <PromiseButton
                        title={inputMark === mark ? MARK_UNCHANGED : undefined}
                        disabled={inputMark === mark}
                        onClick={() => props.onSubmit(mark)}>
                        Change
                    </PromiseButton>
                </Col>
            </Row>
        </div>
    )
}

export default React.memo(MarkPicker)

