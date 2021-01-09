import {configureStore} from '@reduxjs/toolkit';
import user, { UserState } from './slices/user';
import modals, { ModalSliceData } from './slices/modals';
import header, {HeaderData} from './slices/header'

export default configureStore({
    reducer: {
        user,
        modals,
        header
    }
});

export interface StoreData {
    user: UserState,
    modals: ModalSliceData,
    header: HeaderData
}