export function getMarkClass(mark?: number | string): string {
    if(mark != null && mark>0 && mark <= 10) {
        return `mark-${mark}`
    }
    return `mark-na`
}