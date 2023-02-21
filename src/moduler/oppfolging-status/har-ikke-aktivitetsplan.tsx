import { Next } from '@navikt/ds-icons';
import { Alert, Link } from '@navikt/ds-react';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

export const arbeidssokerregistreringHref = process.env.REACT_APP_ARBEIDSSOKERREGISTRERING_URL as string;

interface PropTypes {
    erVeileder: boolean;
}

function HarIkkeAktivitetsplan(props: PropTypes) {
    const { erVeileder } = props;
    const advarsel = erVeileder
        ? 'Denne brukeren har ikke en tidligere aktivitetsplan i Modia.'
        : 'Du må være registrert hos NAV for å bruke aktivitetsplanen.';

    return (
        <div className="har-ikke-aktivitetsplan-container">
            <Alert variant="warning">
                <Normaltekst>{advarsel}</Normaltekst>
                {!erVeileder && (
                    <Link href={arbeidssokerregistreringHref}>
                        Register deg hos NAV
                        <Next />
                    </Link>
                )}
            </Alert>
        </div>
    );
}

export default HarIkkeAktivitetsplan;
