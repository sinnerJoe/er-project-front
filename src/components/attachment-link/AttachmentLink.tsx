
import { LinkOutlined } from '@ant-design/icons'
import React, { ReactNode } from 'react'

export default function AttachmentLink({children}: {children: ReactNode}) {
    return (
        <>
            <LinkOutlined /> <span className="underline">{children}</span>
        </>
    )
}