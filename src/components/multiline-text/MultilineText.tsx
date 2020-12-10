import React, {useState, useRef, useCallback, useMemo} from 'react';

export interface MultilineTextProps {
    children: string
};

export default function MultilineText(props: MultilineTextProps) {
    const lines = props.children.split('\n');

    return (
        <React.Fragment>
            {lines.map((line, index) => {
                if(index !== lines.length - 1) {
                    return (
                        <React.Fragment>
                            {line}
                            <br />
                        </React.Fragment>
                    )
                }
                return line;
            })}
        </React.Fragment>
    )
}