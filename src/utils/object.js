/* eslint-disable import/prefer-default-export */

export function removeEmptyKeysFromObject(object) {
    return Object.keys(object).reduce((obj, key) => {
        // todo: maybe the forms don't have the booleans at a later date, so remove this
        if (
            object[key] === false ||
            object[key] === true ||
            (object[key] && object[key].length > 0)
        ) {
            obj[key] = object[key]; // eslint-disable-line
        }
        return obj;
    }, {});
}
