/* eslint-disable import/prefer-default-export */

export function removeEmptyKeysFromObject<T extends Record<string, any>>(object: T): T {
    return Object.keys(object).reduce((obj: Record<string, any>, key) => {
        if (object[key] !== null && object[key].length <= 0) {
            obj[key] = null; // eslint-disable-line
        } else {
            obj[key] = object[key]; // eslint-disable-line
        }
        return obj as unknown as T;
    }, {}) as T;
}
