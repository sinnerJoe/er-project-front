import { IdIndex } from "shared/interfaces/Id";

export function filterRemoved(initialIds: IdIndex[], actualIds: IdIndex[]) {
    return initialIds.filter(id => !actualIds.includes(id));
}

export function filterAdded(initialIds: IdIndex[], actualIds: IdIndex[]) {
    return actualIds.filter(id => !initialIds.includes(id));
}