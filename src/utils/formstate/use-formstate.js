import { useCallback, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import { createInitialState, fromEntries } from './utils';

export function useFormstateInternal(keys, validation, initialValues) {
    const [submitting, setSubmitting] = useState(false);
    const [state, updateState] = useImmer(
        createInitialState(keys, validation, initialValues)
    );
    const [submittoken, setSubmittoken] = useState(true);

    const values = useMemo(
        () =>
            fromEntries(
                Object.entries(state.fields).map(([key, field]) => [
                    key,
                    field.value,
                ])
            ),
        [state.fields]
    );

    const onChange = useCallback(
        event => {
            const {name} = event.target;
            const {value} = event.target;
            updateState(draft => {
                const oldValue = draft.fields[name].value;

                draft.fields[name].pristine = oldValue === value;
                draft.fields[name].value = value;
                const formHasError = Object.keys(draft.fields)
                    .map(key => {
                        const error = validation[key](
                            draft.fields[key].value,
                            values
                        );
                        draft.fields[key].error = error;
                        return !!error;
                    })
                    .some(error => error);

                if (!formHasError) {
                    setSubmittoken(true);
                }
            });
        },
        [updateState, validation, values]
    );

    const onBlur = useCallback(
        event => {
            const {name} = event.target;
            updateState(draft => {
                draft.fields[name].touched = true;
            });
        },
        [updateState]
    );

    const fieldsArray = useMemo(
        () =>
            Object.entries(state.fields).map(([key, field]) => {
                const fieldstate = {
                    pristine: field.pristine,
                    touched: field.touched,
                    initialValue: field.initialValue,
                    error: field.error,
                    input: {
                        id: key,
                        name: key,
                        value: field.value,
                        onChange,
                        onBlur,
                    },
                };
                return [key, fieldstate];
            }),
        [state.fields, onChange, onBlur]
    );

    const errorsArray = useMemo(
        () =>
            fieldsArray
                .filter(([key, field]) => field.error)
                .map(([key, field]) => [key, field.error]),
        [fieldsArray]
    );

    const pristine = fieldsArray.every(([key, field]) => field.pristine);
    const errors = useMemo(() => fromEntries(errorsArray), [errorsArray]);
    const fields = useMemo(() => fromEntries(fieldsArray), [fieldsArray]);
    const onSubmit = useCallback(
        fn => event => {
            event.preventDefault();
            updateState(draft => {
                Object.keys(draft.fields).forEach(
                    field => (draft.fields[field].touched = true)
                );
            });
            if (errorsArray.length === 0) {
                setSubmitting(true);
                fn(values).then(
                    () => setSubmitting(false),
                    () => setSubmitting(false)
                );
            } else {
                setSubmittoken(false);
            }
        },
        [errorsArray, setSubmitting, values, updateState]
    );

    return useMemo(
        () => ({
            submitting,
            valid: errorsArray.length === 0,
            pristine,
            submittoken,
            errors,
            fields,
            onSubmit,
        }),
        [
            submitting,
            errorsArray,
            pristine,
            submittoken,
            errors,
            fields,
            onSubmit,
        ]
    );
}

export default function useFormstate(validation) {
    const keys = Object.keys(validation);
    // eslint-disable-next-line
    return initialValues =>
        useFormstateInternal(keys, validation, initialValues);
}
