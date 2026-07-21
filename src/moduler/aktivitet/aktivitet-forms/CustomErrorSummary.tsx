import { ErrorSummary } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { z } from 'zod';

interface Props<T extends FieldValues> {
    heading?: string;
    errors: FieldErrors<T> & Record<string, {}>;
}

const CustomErrorSummary = <T extends FieldValues>(props: Props<T>) => {
    const { heading, errors } = props;

    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        errorRef?.current && errorRef.current?.focus();
    }, [errors]);

    if (Object.keys(errors).length === 0) {
        return null;
    }

    return (
        <ErrorSummary ref={errorRef} heading={heading || 'For å gå videre må du rette opp følgende:'}>
            {Object.entries(errors).map(([key, value], index) => {
                const err = value as { type?: string; message?: string; ref?: unknown };
                if (err.type === z.ZodIssueCode.custom) {
                    return <ErrorSummary.Item key={index}>{err.message}</ErrorSummary.Item>;
                }
                const refId = (err.ref as HTMLElement)?.id ?? (err.ref as { name: string })?.name;
                return (
                    <ErrorSummary.Item href={`#${refId}`} key={index}>
                        {err.message}
                    </ErrorSummary.Item>
                );
            })}
        </ErrorSummary>
    );
};

export default CustomErrorSummary;
