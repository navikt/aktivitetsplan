import { ErrorSummary } from '@navikt/ds-react';
import PT from 'prop-types';
import React, { useEffect, useRef } from 'react';

import styles from './feiloppsummering.module.less';

interface Props {
    submittoken: string | undefined;
    errors: Record<string, string | undefined>;
}

function FormErrorSummary({ submittoken, errors }: Props) {
    const summaryRef = useRef<HTMLDivElement>();

    // focus on summary ref when shown
    useEffect(() => {
        if (submittoken) {
            summaryRef?.current?.focus();
            summaryRef?.current?.scrollIntoView && summaryRef.current.scrollIntoView();
        }
    }, [submittoken, summaryRef]);

    if (!submittoken || Object.keys(errors).length === 0) {
        return null;
    }

    const feil = Object.entries(errors)
        .filter(([_, error]) => !!error)
        .map(([name, error]) => ({ skjemaelementId: name, feilmelding: error }));

    return (
        <ErrorSummary
            className={styles.container}
            ref={summaryRef as any}
            heading="For å gå videre må du rette opp følgende:"
        >
            {feil.map(({ skjemaelementId, feilmelding }, index) => (
                <ErrorSummary.Item itemID={skjemaelementId} key={index}>
                    {feilmelding}
                </ErrorSummary.Item>
            ))}
        </ErrorSummary>
    );
}

FormErrorSummary.propTypes = {
    submittoken: PT.string,
    errors: PT.object.isRequired,
};

FormErrorSummary.defaultProps = {
    submittoken: undefined,
};

export default FormErrorSummary;
