export const removeEmptyKeysFromObject = <T extends Record<string, unknown>>(object: T) => {
    return Object.entries(object).reduce(
        (cleaned: Record<string, any>, entry: [string, unknown]) => {
            const [key, val] = entry;
            if (val !== null && typeof val === 'string' && val.length <= 0) {
                cleaned[key] = undefined;
            } else if (val === undefined) {
                cleaned[key] = undefined;
            } else {
                cleaned[key] = val;
            }
            return cleaned;
        },
        {} as Record<string, any>,
    ) as unknown as T;
};
