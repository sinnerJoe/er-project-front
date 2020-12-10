import React, { useEffect } from 'react'
import CenteredForm from 'components/centered-form/CenteredForm'
import FormTitle from 'components/form-title/FormTitle'
import { useHistory } from 'react-router-dom'
import paths from 'paths';

export default function NotAuthenticatedPage() {
    
    const history = useHistory();

    useEffect(() => {
        const key = setTimeout(() => history.replace(paths.LOGIN), 3000);
        return () => clearTimeout(key);
    }, [])
    
    return (
        <CenteredForm>
            <FormTitle>
                You must authenticate to view this page. Redirecting to login...
            </FormTitle>
        </CenteredForm>
    )
}