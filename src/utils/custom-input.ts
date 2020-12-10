

export interface EventWrapper<T> {
    target: {
        value: T
    }
}

export function wrapEventValue<T>(value: T): EventWrapper<T> {
    return {
        target: {value}
    } as EventWrapper<T>;
}