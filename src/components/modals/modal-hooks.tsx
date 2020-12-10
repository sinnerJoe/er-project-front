import React, {useCallback, useState} from 'react'


export function useModal<T extends {visible: boolean, onClose: () => void}>(ModalComponent: React.FC<T>, props: Omit<Omit<T, 'visible'>, 'onClose'>): [React.ReactNode, () => void] {
    
    const [visible, setVisible] = useState(false);
    const openModal = useCallback(() => setVisible(true), []);
    const closeModal = useCallback(() => setVisible(false), []);
    const Component: any = ModalComponent;
    const modalInstance = (
        <Component {...props} visible={visible} onClose={closeModal} />
    );
    

    return [modalInstance, openModal];
}