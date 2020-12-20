import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import _ from 'lodash';
import {useQueryStringMaster} from 'utils/hooks';

import {useDebouncedCallback} from 'use-debounce'

import './YearAxis.scss';
import { useHistory } from 'react-router-dom';
import { getCurrentYear } from 'utils/datetime';

export interface YearAxisProps {
    onChange: (year: number) => void
};


export default function YearAxis(props: YearAxisProps) {
    const history  = useHistory();
    const queryMaster = useQueryStringMaster({year: String(getCurrentYear())})
    const paramYear = Number(queryMaster.year);
    const [year, setYear] = useState(Number(paramYear));
    const [direction, setDirection] = useState('right');
    const handleYearClick = (usedDirection: 'left' | 'right') => (nextYear: number) => {
        setYear(nextYear);
        setDirection(usedDirection)
    }

    const notifyChanged = () => {
        props.onChange(year);
        queryMaster.year = String(year);
        history.push(queryMaster.fullpath);
    }

    useEffect(() => {
        setYear(paramYear)
    }, [paramYear])

    const {callback: debouncedNotify} = useDebouncedCallback(notifyChanged, 800);

    const firstRender = useRef(true);
    useEffect(() => {
        if(firstRender.current) {
            firstRender.current = false;
            return;
        }
        debouncedNotify();
    }, [year]);

    return (
        <div className="year-axis">
            <div className="axis-window">
                <SwitchTransition mode="out-in">
                    <CSSTransition
                        key={year}
                        classNames={`move-${direction}`}
                        timeout={80}
                    >
                        <div className="axis">
                            <YearLabel year={year - 3} onClick={handleYearClick('left')} />
                            <YearLabel year={year - 2} onClick={handleYearClick('left')} />
                            <YearLabel year={year - 1} className="left-neighbor" onClick={handleYearClick('left')} />
                            <YearLabel year={year} className="center-label" onClick={_.noop} />
                            <YearLabel year={year + 1} className="right-neighbor" onClick={handleYearClick('right')} />
                            <YearLabel year={year + 2} onClick={handleYearClick('right')} />
                            <YearLabel year={year + 3} onClick={handleYearClick('right')} />
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </div>
    )
}

function YearLabel({ year, onClick, className }: { year: number, className?: string, onClick: (year: number) => void }) {
    return <div onClick={() => onClick(year)} className={`year-label ${className || ''}`}>{year}</div>
}