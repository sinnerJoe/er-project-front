import { Col, Row, Space } from 'antd'
import React from 'react'
import moment from 'moment';
import { Typography } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';
import { DATE_FORMAT, SERVER_DATE, SERVER_DATE_TIME } from 'shared/constants';
const { Text } = Typography;
type Props = {
    start: string,
    end: string,
    dateFormat?: string
}

export default function DateInterval({start, end, dateFormat = SERVER_DATE_TIME}: Props) {
    return (
        <Row>
            <Col>
                <FieldTimeOutlined className="mr-1"/>
                <Text type="secondary">{moment(start).format(dateFormat)}</Text>
            </Col>
            <Col className="pl-2 pr-2">
                -
            </Col>
            <Col>
                <Text type="secondary">{moment(end).format(dateFormat)}</Text>
            </Col>
        </Row>
    )
}