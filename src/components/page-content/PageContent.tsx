import { Content } from 'antd/lib/layout/layout'
import React, {ReactNode} from 'react'
import './PageContent.scss'

export default function PageContent ({children, spaceTop=false}: {children: ReactNode, spaceTop?: boolean}) {
    return (
        <Content className="page-content-container">
            <div className={ `${spaceTop ? 'pt-5' : ''}` }>
                <div className='page-content'>
                    {children}
                </div>
            </div>
        </Content>
    )
}