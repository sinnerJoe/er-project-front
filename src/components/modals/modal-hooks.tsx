import React, {useCallback, useState} from 'react'


export function useModal<T>(
    ModalComponent: React.FC<T>, 
    props: Omit<Omit<T, 'visible'>, 'onCancel'>
): [React.ReactNode, () => void] {
    
    const [visible, setVisible] = useState(false);
    const openModal = useCallback(() => setVisible(true), []);
    const closeModal = useCallback(() => setVisible(false), []);
    const Component: any = ModalComponent;
    const modalInstance = (
        <Component {...props} visible={visible} onCancel={closeModal} />
    );
    

    return [modalInstance, openModal];
}