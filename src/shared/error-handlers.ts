import { notification } from 'antd';
import _ from 'lodash';
import { AxiosResponse } from 'axios';
import browserHistory from 'shared/history';
import { AxiosResponsePromise, HttpResponseCode, SuccessResponse } from './interfaces/ResponseType';
import paths from 'paths';

export type ErrorHandler<P, C = undefined> = (config: C) => ((request: () => Promise<P>) => Promise<P>)


type NotificationType = 'success' | 'info' | 'warning' | 'error';

const DEFAULT_DURATION = 3.5;

export interface NotificationConfig {
    type?: NotificationType,
    message?: string,
    description?: string,
    duration?: number | null,
    key?: string
}

const NO_RESPONSE = "Server doesn't respond."

export function notify<P>(config: NotificationConfig = {}) {
    return async (response: AxiosResponse<SuccessResponse<P>>) => {
        const {
            type = 'error',
            duration = DEFAULT_DURATION,
            message = "Request Failed",
            key,
            description,
        } = config;

        const defaultDescription = response.data === null ? NO_RESPONSE : '';

        const {
            message: backendMessage = defaultDescription
        } = response.data || {};

        notification.open({
            description: description || backendMessage,
            key,
            duration,
            message,
            type
        });
    }
}

interface NotificationEffect<P> {
    trigger: (response: AxiosResponse<SuccessResponse<P>>) => void,
    absorbRejection?: boolean,
    capture?: HttpResponseCode[],
    captureAllErrors?: boolean
}

export function dispatchNotifications<P>(
    request: () => AxiosResponsePromise<P>,
    chain: NotificationEffect<P>[],
    onResponse: () => void = _.noop): AxiosResponsePromise<P> {
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
                (capture || []).includes(response?.status as HttpResponseCode));

            if (effect) {
                effect.trigger(response);
                if (effect.absorbRejection === false) {
                    reject(error);
                }
            } else {
                reject(error);
            }
        }
        onResponse();
    })
}

const CAPTURE_ALL = [
    HttpResponseCode.BadRequest,
    HttpResponseCode.InternalServerError,
    HttpResponseCode.InvalidMethod,
    HttpResponseCode.NotAuthorized,
    HttpResponseCode.NotFound,
    HttpResponseCode.NotAuthenticated
]

export function generateStdNotification(
    ignoredErrors: HttpResponseCode[] = [],
    config?: NotificationConfig
) {

    return {
        capture: _.difference(CAPTURE_ALL, ignoredErrors),
        trigger: notify(config)
    }
}

export function generateSuccessNotification(
    config?: NotificationConfig
) {

    return {
        trigger: notify({ type: "success", ...config })
    }
}

export const redirectNotFound = {
    capture: [HttpResponseCode.NotFound],
    trigger: () => {
        browserHistory.push(paths.NOT_FOUND);
    }
}

export function handleGetStdErrors<P> (request: () => AxiosResponsePromise<P>, onResponse?: () => void) {
    return dispatchNotifications(request, [generateStdNotification()], onResponse);
}