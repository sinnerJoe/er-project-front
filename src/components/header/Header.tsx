import React from 'react'
import { Row, Col, Avatar } from 'antd'
import IconLink from 'components/icon-link/IconLink'
import {HomeFilled, DatabaseFilled} from '@ant-design/icons';
import paths from 'paths'

import './Header.scss';
function Header(props: {}) {

    return (
        // <div id="header">
           <Row align="middle" id="header" className="pr-7 pl-7">
               <Col span={8}>
                <Row justify="start" className="pl-4">

                    <IconLink 
                        to={paths.MAIN_PAGE}
                        label={'Home'}
                        icon={<HomeFilled />} 
                        className="underline"
                        />
                </Row>
                </Col>
                <Col span={8}>
                    <Row justify="center">

                    <IconLink 
                        to={paths.MAIN_PAGE}
                        label={'My diagrams'}
                        icon={<DatabaseFilled />} 
                        />
                    </Row>

                </Col>
                <Col span={8}>
                    <Row justify="end" className="pr-2">
                        <Avatar>RC</Avatar>
                    </Row>
                </Col>
                
           </Row> 
        // </div>
    )
}

export default Header;