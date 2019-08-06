/* eslint-disable import/prefer-default-export */

export function removeEmptyKeysFromObject(object) {
    return Object.keys(object).reduce((obj, key) => {
        if (object[key].length > 0) {
            obj[key] = object[key]; // eslint-disable-line
        }
        return obj;
    }, {});
}
