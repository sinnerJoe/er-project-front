import React from 'react'
import { Row, Col, Avatar } from 'antd'
import IconLink from 'components/icon-link/IconLink'
import { HomeFilled, DatabaseFilled, UserOutlined, MenuOutlined, SettingFilled, ArrowRightOutlined, RightOutlined, LeftOutlined, FormOutlined, FileTextOutlined, LogoutOutlined, ContainerOutlined, SecurityScanOutlined, SecurityScanFilled, PlusOutlined, SolutionOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import paths from 'paths'

import './Header.scss';
import NavigationMenu from 'components/navigation-menu/NavigationMenu';
import { NavItem } from 'components/navigation-menu/MenuItems';
import { DropdownItem, DropdownMenu } from 'components/navigation-menu/DropdownMenu';

const BackButtonItem = ({ children }: { children: React.ReactNode }) => (
    <DropdownItem openedMenu="main" leftIcon={<LeftOutlined />}>
        <h3 className="pt-0 pb-0 mb-0 inherit-color bold">
            {children}
        </h3>
    </DropdownItem>
)

const rightMenus = {
    "settings": (
        <React.Fragment>
            <BackButtonItem>
                Settings
            </BackButtonItem>
            <DropdownItem leftIcon={<UserOutlined />}>
                Edit Profile
            </DropdownItem>
            <DropdownItem leftIcon={<SecurityScanFilled />}>
                Change Password
            </DropdownItem>
        </React.Fragment>
    ),
    "create": (
        <React.Fragment>
            <BackButtonItem>
                Create New
            </BackButtonItem>
            <DropdownItem leftIcon={<SolutionOutlined />} link={paths.NEW_DIAGRAM}>
                Solution
            </DropdownItem>
            <DropdownItem leftIcon={<AppstoreAddOutlined />} link={paths.EDIT_ASSIGNMENT}>
               Assignment 
               </DropdownItem>

        </React.Fragment>
    )
}
function Header(props: {}) {

    return (
        <NavigationMenu>
            <NavItem icon={<UserOutlined />} destination="" />
            <NavItem icon={<MenuOutlined />} destination="" >
                <DropdownMenu rightMenus={rightMenus}>
                    <DropdownItem openedMenu="settings"
                        leftIcon={<SettingFilled />}
                        rightIcon={<RightOutlined />}
                    >
                        Settings
                    </DropdownItem>
                    <DropdownItem openedMenu="create"
                        leftIcon={<PlusOutlined />}
                        rightIcon={<RightOutlined />}
                    >
                        Create New
                    </DropdownItem>
                    <DropdownItem leftIcon={<ContainerOutlined />} link={paths.MY_DIAGRAM}>
                        My Solutions
                    </DropdownItem>
                    <DropdownItem leftIcon={<FormOutlined />} link={paths.STUDENT_ASSIGNMENTS}>
                        My Assignments
                    </DropdownItem>
                    <DropdownItem leftIcon={<FormOutlined />} link={paths.PROFESSOR_ASSIGNMENTS}>
                        Assignments(Professor)
                    </DropdownItem>
                    <DropdownItem leftIcon={<LogoutOutlined />} link={paths.PROFESSOR_ASSIGNMENTS}>
                        Log Out
                    </DropdownItem>
                </DropdownMenu>
            </NavItem>
        </NavigationMenu>)
}

export default Header;