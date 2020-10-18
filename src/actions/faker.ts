
export function fakeGet<T>(value: T):Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(value), 200);
    })
}