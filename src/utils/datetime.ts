import { Plan } from 'interfaces/Plan';
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

export function extractEducationalYear(date: Moment): number {
    return moment(date).subtract(9, 'months').get('year')
}

export function getCurrentYear(): number {
    return extractEducationalYear(moment());
}

function isLeap(year: number): boolean {
    if(year % 400 == 0) return true;
    if(year % 100 == 0) return false;
    return year % 4 == 0;
}

export function normalizeDate(date: Moment, year: number): Moment {
    const month = date.get("month");

    if(month < 8 && month >= 0) {
        const day = date.get('date');
        if(isLeap(year + 1) || month != 1 || day != 29) {
            return moment(date).set('year', year + 1);
        }
        return moment(date).set('day', 28).set('year', year + 1);
    }
    return moment(date).set('year', year);
}

export function normalizePlanDates (plan: Plan) {
    const currentYear = getCurrentYear();
    for(const assignment of plan.plannedAssignments) {
        assignment.endDate = normalizeDate(moment(assignment.endDate), currentYear);
        assignment.startDate = normalizeDate(moment(assignment.startDate), currentYear);
    }
}