import React from 'react'
import CenteredForm from 'components/centered-form/CenteredForm'
import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import paths from 'paths'

export default function NotFoundPage() {
    return (
        <CenteredForm>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Link to={paths.MAIN_PAGE}><Button type="primary">Back Home</Button></Link>}
            />
        </CenteredForm>
    )
}