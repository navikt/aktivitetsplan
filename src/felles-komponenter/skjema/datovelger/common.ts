import { DateValidationT } from '@navikt/ds-react';

type Handler = React.FocusEventHandler | React.ChangeEventHandler<HTMLInputElement> | undefined;

export function handlers<Event = React.FocusEvent | React.ChangeEvent<HTMLInputElement>>(handlers: Handler[]) {
    return (event: Event) => {
        handlers.filter((it) => it).forEach((handler) => handler!!(event as any));
    };
}

export const coerceToUndefined = (val: string | Date | undefined | null): Date | undefined => {
    if (val === undefined || val === '' || val === null) return undefined;
    return typeof val === 'string' ? new Date(val) : val;
};

export const validateStandardDateErrors = (validation?: DateValidationT, required: boolean): string | undefined => {
    if (!validation) return;
    if (!validation.isEmpty && !validation.isValidDate) {
        return 'Ikke en gyldig dato';
    }
};
