export function fromEntries(data) {
    return data.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
}

export function createInitialState(keys, validation, initialValues) {
    return () => {
        const fields = fromEntries(
            keys.map(key => {
                const field = {
                    pristine: true,
                    touched: false,
                    initialValue: initialValues[key],
                    error: validation[key](initialValues[key], initialValues),
                    value: initialValues[key],
                };

                return [key, field];
            })
        );

        return { fields };
    };
}
