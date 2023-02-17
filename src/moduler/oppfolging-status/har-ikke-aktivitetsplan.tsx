import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { HoyreChevron } from 'nav-frontend-chevron';
import Lenke from 'nav-frontend-lenker';
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
            <AlertStripeAdvarsel>
                <Normaltekst>{advarsel}</Normaltekst>
                {!erVeileder && (
                    <Lenke href={arbeidssokerregistreringHref}>
                        Register deg hos NAV
                        <HoyreChevron />
                    </Lenke>
                )}
            </AlertStripeAdvarsel>
        </div>
    );
}

export default HarIkkeAktivitetsplan;
