import { createSlice } from "@reduxjs/toolkit";
import { ModalProps } from "antd/lib/modal";
import {Modal} from "antd";
import { PartialBy } from "interfaces/helpers";

export enum ModalType {
    CreateSolution,
}

export enum ModalLevel {
    Regular,
    Warning
}

export interface ModalInstance {
    level: ModalLevel,
    modalType: ModalType, 
    props?: Object
}

export interface ModalSliceData {
    displayedModals: Record<number, ModalInstance>
}

const initialState: ModalSliceData = {
    displayedModals: {},
};

const modalSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        openModal(state, {payload: {modalType, props, modalId, level}}) {
            const newInstance = {modalType, props, modalId, level};
            state.displayedModals = {...state.displayedModals, [modalId]: newInstance};
        },

        updateProps(state, {payload: {props, modalId}}) {
            const data = {...state.displayedModals}
            data[modalId] = {...data[modalId], props};
            state.displayedModals = data;
        },

        closeModal(state, {payload: {modalId}}) {
            
            const data = {...state.displayedModals};
            delete data[modalId];

            state.displayedModals = data;
        }
    }
})


export const {openModal, updateProps, closeModal} = modalSlice.actions;

export default modalSlice.reducer;