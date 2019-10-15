import React from 'react';
import { FormattedMessage } from 'react-intl';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { HoyreChevron } from 'nav-frontend-chevron';
import Lenke from 'nav-frontend-lenker';

export const arbeidssokerregistreringHref = '/arbeidssokerregistrering';

interface PropTypes {
    erVeileder: boolean;
}

function HarIkkeAktivitetsplan(props: PropTypes) {
    const { erVeileder } = props;
    const advarsel = erVeileder
        ? 'har.ikke.aktivitetsplan.advarsel.veileder'
        : 'har.ikke.aktivitetsplan.advarsel.bruker';

    return (
        <div className="har-ikke-aktivitetsplan-container">
            <AlertStripeAdvarsel>
                <Normaltekst>
                    <FormattedMessage id={advarsel} />
                </Normaltekst>
                {!erVeileder && (
                    <Lenke href={arbeidssokerregistreringHref}>
                        <FormattedMessage id="ikke.under.oppfolging.reaktivering.lenke" />
                        <HoyreChevron />
                    </Lenke>
                )}
            </AlertStripeAdvarsel>
        </div>
    );
}

export default HarIkkeAktivitetsplan;
