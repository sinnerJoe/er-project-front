import store from 'store';
import {openModal, updateProps, closeModal, ModalType, ModalLevel} from 'store/slices/modals';

let lastId = 0;

export default class ModalController {

    static open(modalType: ModalType, props: any = {}, level = ModalLevel.Regular): number {
        const modalId = lastId;
        lastId += 1;  
        store.dispatch(openModal({modalType, modalId, level, props}));  
        return modalId;
    }
    
    static close(modalId: number) {
        store.dispatch(closeModal({modalId}));
    }
    
    static update(modalId: number, props: any) {
        store.dispatch(updateProps({props, modalId}));
    }
}