import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import React from 'react';

import { ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import { useKanSendeVarsel } from './avtaltHooks';

const getText = (
    kanSendeVarsel: boolean,
    avtaltMedNavMindreEnnSyvDager: boolean,
    forhaandsorienteringstype: ForhaandsorienteringType
): string => {
    if (!kanSendeVarsel) {
        return 'Aktiviteten er merket "Avtalt med NAV" og forhåndsorientering er ikke sendt.';
    }
    if (avtaltMedNavMindreEnnSyvDager) {
        return 'Aktiviteten er merket "Avtalt med NAV". Forhåndsorientering er ikke sendt, men brukeren skal være informert om mulige konsekvenser for ytelse og du skal ha dokumentert dette.';
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
    forhaandsorienteringstype: ForhaandsorienteringType;
    className?: string;
}

//TODO: Husk å slette tekstfil sett-avtalt-bekreftelse
const SattTilAvtaltInfotekst = (props: Props) => {
    const kanSendeVarsel = useKanSendeVarsel();

    const { mindreEnnSyvDagerTil, forhaandsorienteringstype, className } = props;

    const text = getText(kanSendeVarsel, mindreEnnSyvDagerTil, forhaandsorienteringstype);

    return (
        <>
            <div className={className}>
                <AlertStripeSuksess>{text}</AlertStripeSuksess>
            </div>
            <DeleLinje />
        </>
    );
};

export default SattTilAvtaltInfotekst;
