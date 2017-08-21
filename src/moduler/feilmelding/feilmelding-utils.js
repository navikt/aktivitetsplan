import React from 'react';
import {
    AlertStripeAdvarsel,
    AlertStripeInfo,
    AlertStripeInfoSolid,
} from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';

const DEFCON_1 = (
    <AlertStripeAdvarsel>
        <FormattedMessage id="feilmelding.server-error.tekst" />
    </AlertStripeAdvarsel>
);

const DEFCON_2 = (
    <AlertStripeInfoSolid>
        <FormattedMessage id="feilmelding.forbidden.tekst" />
    </AlertStripeInfoSolid>
);

const DEFCON_3 = (
    <AlertStripeInfo>
        <FormattedMessage id="feilmelding.bad-request.tekst" />
    </AlertStripeInfo>
);

const feiltyper = {
    1: DEFCON_1,
    2: DEFCON_2,
    3: DEFCON_3,
};

const rangering = {
    UKJENT: 1,
    FINNES_IKKE: 1,
    INGEN_TILGANG: 2,
    UGYLDIG_REQUEST: 3,
};

function finnHoyesteAlvorlighetsgrad(feilmeldinger) {
    return Math.min(
        ...feilmeldinger.map(feilmelding => {
            const type = feilmelding.type || 'UKJENT';
            return rangering[type];
        })
    );
}

// eslint-disable-next-line import/prefer-default-export
export const mapTyperTilAlertstripe = feilmeldinger =>
    feiltyper[finnHoyesteAlvorlighetsgrad(feilmeldinger)];
