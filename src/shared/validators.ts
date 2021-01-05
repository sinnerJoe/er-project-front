
export function emptySpace(rule: any, v: string) {
    return !v.trim() ? Promise.reject(): Promise.resolve();
}