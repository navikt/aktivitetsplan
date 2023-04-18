import { DateValidationT } from '@navikt/ds-react';
import { MouseEventHandler, useEffect } from 'react';

type Handler = React.FocusEventHandler | React.ChangeEventHandler<HTMLInputElement> | undefined;

export function handlers<Event = React.FocusEvent | React.ChangeEvent<HTMLInputElement>>(handlers: Handler[]) {
    return (event: Event) => {
        handlers.filter((it) => it).forEach((handler) => handler!(event as any));
    };
}

export const coerceToUndefined = (val: string | Date | undefined | null): Date | undefined => {
    if (val === undefined || val === '' || val === null) return undefined;
    return typeof val === 'string' ? new Date(val) : val;
};

export const validateStandardDateErrors = (validation?: DateValidationT, required: boolean): string | undefined => {
    if (!validation) return;
    if (!validation.isEmpty && !validation.isValidDate && !validation.isDisabled) {
        return 'Ikke en gyldig dato';
    }
};

export const useOutsideClick = (open: boolean, onToggle: () => void) => {
    useEffect(() => {
        if (open) {
            window.addEventListener('click', onToggle);
        }
        return () => window.removeEventListener('click', onToggle);
    }, [onToggle]);
};

export const preventCloseOnInsideClick: MouseEventHandler = (event) => {
    event.stopPropagation();
};
