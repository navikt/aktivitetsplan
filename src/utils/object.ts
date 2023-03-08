export const removeEmptyKeysFromObject = <T extends Record<string, any>>(object: T) => {
    return Object.entries(object).reduce((obj, [key, val]) => {
        if (val !== null && typeof val === 'string' && val.length <= 0) {
            obj[key] = null;
        } else {
            obj[key] = val;
        }
        return obj;
    }, {} as Record<string, any>) as T;
};
