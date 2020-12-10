import React, { useState } from 'react'
import { Button, Col, Input, Row } from 'antd'
import { PlusSquareFilled, SearchOutlined, UserOutlined } from '@ant-design/icons';
import './SearchBox.scss';
import { Link } from 'react-router-dom';

const sideDivs = {
    lg: 7,
    md: 6,
    xs: 0
};

interface Props {
    onChange: (query: string) => unknown
    buttonLabel?: string
    onButtonClick?: () => unknown
}

export default function SearchBox(props: Props) {
    const [query, setQuery] = useState("");

    return (
        <div className="mt-10 mb-10">
            <Row gutter={[10, 10]}>
                <Col lg={7} md={6} xs={0} />
                <Col lg={10} md={12} xs={24}>
                    <Row justify="center" >
                        <Col span={24}>
                            <Input value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                size="large"
                                prefix={<SearchOutlined />}
                            />
                        </Col>
                    </Row>
                </Col>

                <Col {...sideDivs} xs={{span: 24}} sm={{span: 24}}>
                        { props.onButtonClick && 
                        <Button
                            onClick={props.onButtonClick}
                            size="large"
                            type="primary"
                            icon={<PlusSquareFilled />}
                            >
                            {props.buttonLabel}
                        </Button>
                        }
                </Col>
            </Row>
        </div>
    )
}