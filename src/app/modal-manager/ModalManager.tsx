import React from 'react'
import _ from 'lodash';
import { useSelector } from 'react-redux'
import { StoreData } from 'store'
import { ModalInstance, ModalLevel, ModalSliceData } from 'store/slices/modals'
import ModalController from './ModalController';
import ModalDictionary from './ModalDictionary';

interface KeyedModalInstance {
    instance: ModalInstance,
    key: string
};

function orderModals(data: ModalSliceData): KeyedModalInstance[] {
    const layers: KeyedModalInstance[][] = [];
    Object.values(ModalLevel).forEach((value) => {
        layers[value] = [];
    });

    Object.entries(data.displayedModals).forEach(([key, modalInstance]) => {
        layers[modalInstance.level].push({ instance: modalInstance, key });
    });

    return _.flatten(layers);
}

export default function ModalManager(props: {}) {
    const modals = useSelector<StoreData, ModalSliceData>((state) => state.modals);

    const orderedModals = orderModals(modals);

    return (
        <React.Fragment>
            {
                orderedModals.map(({ instance: { modalType, props: {onOk, ...rest} = {} }, key }) => {
                    const closeModal = () => ModalController.close(key as any);
                    const ModalComponent = ModalDictionary[modalType];
                    return (
                        <ModalComponent
                            {...props}
                            key={key}
                            onOk={() => {
                                onOk();
                            }}
                            onCancel={closeModal}
                            visible={true}
                        />
                    )
                })
            }
        </React.Fragment>
    )
}