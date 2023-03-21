import { ErrorSummary } from '@navikt/ds-react';
import { errors } from 'msw';
import PT from 'prop-types';
import React, { useEffect, useRef } from 'react';

import styles from './feiloppsummering.module.less';

interface Props {
    errors: Record<string, string | undefined>;
}

function FormErrorSummary({ errors }: Props) {
    const summaryRef = useRef<HTMLDivElement>();

    // focus on summary ref when shown
    useEffect(() => {
        summaryRef?.current?.focus();
        summaryRef?.current?.scrollIntoView && summaryRef.current.scrollIntoView();
    }, [summaryRef]);

    if (Object.keys(errors).length === 0) {
        return null;
    }

    const feil = Object.entries(errors)
        .filter(([_, error]) => !!error)
        .map(([name, error]) => ({ skjemaelementId: name, feilmelding: error }));

    if (feil.length === 1) {
        // Don't show summary when only one error
        return null;
    }

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

const FormErrorSummaryWrapper = ({ errors }: Props) => {
    if (!errors || Object.keys(errors).length === 0) return null;
    return <FormErrorSummary errors={errors} />;
};

FormErrorSummary.propTypes = {
    submittoken: PT.string,
    errors: PT.object.isRequired,
};

FormErrorSummary.defaultProps = {
    submittoken: undefined,
};

export default FormErrorSummaryWrapper;
