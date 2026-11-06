import { ErrorSummary } from '@navikt/ds-react';
import React, { useRef } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';

interface Props<T extends FieldValues> {
    heading?: string;
    errors: FieldErrors<T> & Record<string, {}>;
}

const flattenErrors = (
    errors: Record<string, unknown>,
    parentPath = '',
): { message: string; ref?: unknown; path: string }[] =>
    Object.entries(errors).flatMap(([key, value]) => {
        if (key === 'ref' || key === 'types') return [];
        if (!value || typeof value !== 'object') return [];
        const path = parentPath ? `${parentPath}.${key}` : key;
        if ('message' in value && typeof value.message === 'string') {
            return [{ message: value.message, ref: 'ref' in value ? value.ref : undefined, path }];
        }
        return flattenErrors(value as Record<string, unknown>, path);
    });

const CustomErrorSummary = <T extends FieldValues>(props: Props<T>) => {
    const { heading, errors } = props;

    const errorRef = useRef<HTMLDivElement>(null);

    if (Object.keys(errors).length === 0) {
        return null;
    }

    return (
        <ErrorSummary ref={errorRef} heading={heading || 'For å gå videre må du rette opp følgende:'}>
            {flattenErrors(errors).map((err, index) => {
                const refId =
                    (err.ref as HTMLElement)?.id ??
                    (err.ref as { name: string })?.name ??
                    (err.ref ? err.path : undefined);
                return (
                    <ErrorSummary.Item href={refId ? `#${refId}` : undefined} key={index}>
                        {err.message}
                    </ErrorSummary.Item>
                );
            })}
        </ErrorSummary>
    );
};

export default CustomErrorSummary;
