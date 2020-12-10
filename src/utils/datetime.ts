import moment, {Moment} from 'moment';
import { SERVER_DATE_TIME } from 'shared/constants';

export function lastSecond(val: Moment = moment()) {
    const res = moment(val);
    res.set('hour', 23);
    res.set('minute', 59);
    res.set('second', 59);
    return res;
}

export function firstSecond(val: Moment = moment()) {
    const res = moment(val);
    res.set('hour', 0);
    res.set('minute', 0);
    res.set('second', 0);
    return res;
}

const dateFields = new Set([
    'startDate',
    'endDate',
    'updatedAt',
    'createdAt'
]);

export function momentifyFields(object: any, fields = dateFields): void {
    if(object == null) return;
    for(const key of Object.keys(object)) {
        if(typeof object[key] === 'object') {
            momentifyFields(object[key], fields);
        } else if(fields.has(key) && typeof object[key] === 'string') {
            const m = moment(object[key], SERVER_DATE_TIME);
            object[key] = m.isValid() ? m : object[key];
        }
    }
}