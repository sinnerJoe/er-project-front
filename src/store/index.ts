import {configureStore} from '@reduxjs/toolkit';
import user, { UserState } from './slices/user';
import modals, { ModalSliceData } from './slices/modals';

export default configureStore({
    reducer: {
        user,
        modals
    }
});

export interface StoreData {
    user: UserState,
    modals: ModalSliceData
}