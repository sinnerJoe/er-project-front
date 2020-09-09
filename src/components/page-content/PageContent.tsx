import React, {ReactNode} from 'react'
import './PageContent.scss'

export default function PageContent ({children}: {children: ReactNode}) {
    return (
        <div className='page-content-container'>
            {children}
        </div>
    )
}