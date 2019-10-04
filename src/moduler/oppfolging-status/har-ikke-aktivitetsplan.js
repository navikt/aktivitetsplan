import React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { HoyreChevron } from 'nav-frontend-chevron';
import PT from 'prop-types';
import Lenke from '../../felles-komponenter/utils/lenke';

export const arbeidssokerregistreringHref = '/arbeidssokerregistrering';

function HarIkkeAktivitetsplan({ erVeileder }) {
    const advarsel = erVeileder
        ? 'Denne brukeren er ikke registrert.'
        : 'Du må være registrert hos NAV for å bruke aktivitetsplanen.';

    return (
        <div className="har-ikke-aktivitetsplan-container">
            <AlertStripeAdvarsel>
                <Normaltekst>{advarsel}</Normaltekst>
                {!erVeileder && (
                    <Lenke href={arbeidssokerregistreringHref} erEksternLenke>
                        Register deg hos NAV
                        <HoyreChevron />
                    </Lenke>
                )}
            </AlertStripeAdvarsel>
        </div>
    );
}

HarIkkeAktivitetsplan.propTypes = {
    erVeileder: PT.bool.isRequired
};

export default HarIkkeAktivitetsplan;
