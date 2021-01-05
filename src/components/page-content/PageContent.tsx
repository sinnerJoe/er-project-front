import React, {ReactNode} from 'react'
import './PageContent.scss'

export default function PageContent ({children, spaceTop=false}: {children: ReactNode, spaceTop?: boolean}) {
    return (
        <div className={ `page-content-container ${spaceTop ? 'pt-5' : ''}` }>
            <div className='page-content'>
                {children}
            </div>
        </div>
    )
}