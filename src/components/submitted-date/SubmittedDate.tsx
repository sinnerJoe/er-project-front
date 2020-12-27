import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import moment, { Moment } from 'moment';
import { Tag, Typography } from 'antd';
import { SERVER_DATE_TIME } from 'shared/constants';

const {Text} = Typography

export interface SubmittedDateProps {
    date: string | Moment,
    endDate: string | Moment,
    startDate: string | Moment
};

export default function SubmittedDate({date, endDate, startDate}: SubmittedDateProps) {

    
    const endDateMoment = moment(endDate)
    const startDateMoment = moment(startDate)

    const dateMoment = moment(date);

    const formattedDate = moment(date).format(SERVER_DATE_TIME);

    if(dateMoment.isAfter(endDateMoment)) {
        return <Text type="danger">
            {formattedDate} ({moment.duration(dateMoment.diff(endDateMoment)).humanize()} late)
        </Text>
    }

    if(dateMoment.isBefore(startDateMoment)) {
        return <Text type="warning">
            {formattedDate}
        </Text>
    }
   
    return (
        <Text type="success" className="ant-tag-success">
            {formattedDate}
        </Text>
    )
}