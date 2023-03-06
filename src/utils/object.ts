/* eslint-disable import/prefer-default-export */

export const removeEmptyKeysFromObject = <T extends Record<string, any>>(object: T) => {
    return Object.entries(object).reduce((obj, [key, val]) => {
        if (val !== null && typeof val === 'string' && val.length <= 0) {
            obj[key] = null; // eslint-disable-line
        } else {
            obj[key] = val; // eslint-disable-line
        }
        return obj;
    }, {} as Record<string, any>) as T;
};
