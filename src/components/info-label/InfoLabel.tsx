import React, { ReactNode, memo, ReactChildren } from 'react'

import "./InfoLabel.scss";

function InfoLabel({text, children, className = ""}:{text: ReactNode, children: ReactNode, className?: string}) {
    return (
        <div className={`info-label ${className}`}>
            <label>
                {text}
            </label>
            <div className="content">{children}</div>
        </div>
    )    
}

export default memo(InfoLabel);