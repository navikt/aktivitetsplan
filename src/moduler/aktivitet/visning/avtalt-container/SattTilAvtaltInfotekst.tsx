import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import React from 'react';

import { ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import aktivitetvisningStyles from '../Aktivitetsvisning.module.css';
import { useKanSendeVarsel } from './avtaltHooks';

const getText = (
    kanSendeVarsel: boolean,
    avtaltMedNavMindreEnnSyvDager: boolean,
    harTilDato: boolean,
    forhaandsorienteringstype: ForhaandsorienteringType
): string => {
    if (!kanSendeVarsel || !harTilDato) {
        return 'Aktiviteten er merket "Avtalt med NAV". Forhåndsorientering er ikke lagt til. Du skal ha informert bruker om mulige konsekvenser for ytelse og dokumentert dette i et samtalereferat.';
    }
    if (avtaltMedNavMindreEnnSyvDager) {
        return 'Aktiviteten er merket "Avtalt med NAV". Forhåndsorientering er ikke lagt til fordi sluttdatoen er færre enn 7 dager frem i tid. Du skal ha informert bruker om mulige konsekvenser for ytelse og dokumentert dette i et samtalereferat.';
    }

    switch (forhaandsorienteringstype) {
        case ForhaandsorienteringType.IKKE_SEND:
            return 'Aktiviteten er merket "Avtalt med NAV" og forhåndsorientering om konsekvens for ytelse er ikke lagt til aktiviteten.';
        case ForhaandsorienteringType.SEND_STANDARD:
            return 'Forhåndsorientering (standard melding) er lagt til aktiviteten. Bruker får sms eller e-post.';
        case ForhaandsorienteringType.SEND_PARAGRAF_11_9:
            return 'Forhåndsorientering for §11-9 (AAP) er lagt til aktiviteten. Bruker får sms eller e-post.';
    }
    return 'Noe er feil, kontakt brukerstøtte';
};

interface Props {
    mindreEnnSyvDagerTil: boolean;
    harTilDato: boolean;
    forhaandsorienteringstype: ForhaandsorienteringType;
}

//Senere: Husk å slette tekstfil sett-avtalt-bekreftelse
const SattTilAvtaltInfotekst = (props: Props) => {
    const kanSendeVarsel = useKanSendeVarsel();

    const { mindreEnnSyvDagerTil, harTilDato, forhaandsorienteringstype } = props;

    const text = getText(kanSendeVarsel, mindreEnnSyvDagerTil, harTilDato, forhaandsorienteringstype);

    return (
        <div className={aktivitetvisningStyles.underseksjon}>
            <AlertStripeSuksess>{text}</AlertStripeSuksess>
        </div>
    );
};

export default SattTilAvtaltInfotekst;
