import { notification } from 'antd';
import { AxiosResponse } from 'axios';
import { config } from 'react-transition-group';
import { AxiosResponsePromise, RequestErrorStatus, SuccessResponse } from './interfaces/ResponseType';

export type ErrorHandler<P, C = undefined> = (config: C) => ((request: () => Promise<P>) => Promise<P>)


type NotificationType = 'success' | 'info' | 'warning' | 'error';

const DEFAULT_DURATION = 3.5;

export function notify<P>(config: { type?: NotificationType, message?: string, description?: string, duration?: number | null } = {}) {
    return async (response: AxiosResponse<SuccessResponse<P>>) => {
        const { type = 'error', message = "Request Failed", description, duration = DEFAULT_DURATION } = config;
        const {
            data: { message: backendMessage = "" } = {}
        } = response;

        notification.open({
            duration: duration,
            description: description || backendMessage,
            message,
            type
        });
    }
}

interface NotificationEffect<P> {
    trigger: (response: AxiosResponse<SuccessResponse<P>>) => void,
    absorbRejection?: boolean,
    capture?: RequestErrorStatus[],
    captureAllErrors?: boolean
}

export function dispatchNotifications<P>(request: () => AxiosResponsePromise<P>, chain: NotificationEffect<P>[]) {
    return new Promise(async (resolve, reject) => {
        let response: AxiosResponse<SuccessResponse<P>> | undefined = undefined;
        let error: AxiosResponse<SuccessResponse<P>> | undefined = undefined;
        try {
            response = await request();
        } catch (err) {
            response = err.response;
            error = err;
        }

        if (response) {
            if (!error) {
                const effect = chain.find(({ capture }) => !capture)
                if (effect) {
                    effect.trigger(response);
                }
                resolve(response);
            }

            const effect = chain.find(({ capture, captureAllErrors }) => captureAllErrors ||
                (capture || []).includes(response?.data?.status as RequestErrorStatus));

            if (effect) {
                effect.trigger(response);
                if (effect.absorbRejection === false) {
                    reject(error);
                }
            } else {
                reject(error);
            }
        }
    })
}

export const STANDARD_ERROR_NOTIFICATION = {
    capture: [
        RequestErrorStatus.BadParameter,
        RequestErrorStatus.InternalServerError,
        RequestErrorStatus.InvalidMethod
    ],
    trigger: notify()
};