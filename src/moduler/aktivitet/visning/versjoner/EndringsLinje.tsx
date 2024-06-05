import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import { formaterDatoEllerTidSiden } from '../../../../utils/dateUtils';
import { Endring } from '../../../../datatypes/Historikk';
import { useErVeileder } from '../../../../Provider';

const splittPåEndretAvOgEndringsbeskrivelse = (beskrivelse: string) => {
    const førsteOrd = beskrivelse.split(' ')[0];
    return [førsteOrd, beskrivelse.replace(førsteOrd, '')];
};

export const EndringsLinje = ({ endring }: { endring: Endring }) => {
    const erBruker = !useErVeileder();

    const beskrivelse = erBruker ? endring.beskrivelseForBruker : endring.beskrivelseForVeileder;
    const [endretAv, endringsbeskrivelse] = splittPåEndretAvOgEndringsbeskrivelse(beskrivelse);

    return (
        <div className="pb-4">
            <b>{endretAv}</b> {endringsbeskrivelse}
            <BodyShort>{formaterDatoEllerTidSiden(endring.tidspunkt)}</BodyShort>
        </div>
    );
};
