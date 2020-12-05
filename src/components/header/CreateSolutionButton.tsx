import React, { useCallback } from 'react';

import {DropdownItem} from 'components/navigation-menu/DropdownMenu';
import { SolutionOutlined } from '@ant-design/icons';
import ModalManager from 'app/modal-manager/ModalManager';
import ModalController from 'app/modal-manager/ModalController';
import { ModalType } from 'store/slices/modals';

export default function CreateSolutionButton() {

    const handleClick = useCallback(() => ModalController.open(ModalType.CreateSolution), []);

    return  ( 
            <DropdownItem leftIcon={<SolutionOutlined />} onClick={handleClick}>
                Solution
            </DropdownItem>
 )
}