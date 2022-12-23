import { Feiloppsummering } from 'nav-frontend-skjema';
import PT from 'prop-types';
import React, { useEffect, useRef } from 'react';

import styles from './feiloppsummering.module.less';

function FormErrorSummary({ submittoken, errors }) {
    const summaryRef = useRef(null);

    // focus on summary ref when shown
    useEffect(() => {
        if (submittoken) {
            summaryRef.current.focus();
            summaryRef.current.scrollIntoView && summaryRef.current.scrollIntoView();
        }
    }, [submittoken, summaryRef]);

    if (!submittoken || Object.keys(errors).length === 0) {
        return null;
    }

    const feil = Object.entries(errors).map(([name, error]) => ({ skjemaelementId: name, feilmelding: error }));

    return (
        <Feiloppsummering
            className={styles.container}
            innerRef={summaryRef}
            tittel="For å gå videre må du rette opp følgende:"
            feil={feil}
        />
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
