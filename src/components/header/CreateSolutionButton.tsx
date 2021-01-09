import React, { useCallback } from 'react';

import {DropdownItem} from 'components/navigation-menu/DropdownMenu';
import { SolutionOutlined } from '@ant-design/icons';
import ModalManager from 'app/modal-manager/ModalManager';
import ModalController from 'app/modal-manager/ModalController';
import { ModalType } from 'store/slices/modals';
import paths from 'paths';

export default function CreateSolutionButton() {


    return  ( 
            <DropdownItem leftIcon={<SolutionOutlined />} link={paths.NEW_DIAGRAM}>
                Solution
            </DropdownItem>
 )
}