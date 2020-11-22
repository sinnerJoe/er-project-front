import _ from 'lodash';

type ResultItem = string | { property: string, defaultValue: any }

export function reshape(shape: Record<string,ResultItem>, object: Object) {
    const result: any = {}
    for(const key of Object.keys(shape)) {
        const shapeEntry = shape[key];
        switch(typeof shapeEntry) {
            case 'string':
                if(!_.hasIn(object, key)) {
                    result[shapeEntry] = object[key];
                } 
                break;
            case 'object': {
                result[shapeEntry.property] = _.hasIn(object, key) ? object[key] : shapeEntry.defaultValue;
                break;
            }
        } 
    }
    return result;
}

export function shapeBack(shape: Record<string, ResultItem>, object: Object) {
    const result: any = {}
    for(const key of Object.keys(shape)) {
        const shapeEntry = shape[key];
        if(typeof shapeEntry === 'string' && _.hasIn(object, shapeEntry)) {
            result[key] = object[shapeEntry];
        } else if(typeof shapeEntry === 'object' && _.hasIn(object, shapeEntry.property)) {
            result[key] = object[shapeEntry.property];
        }
    }
    return result;
}