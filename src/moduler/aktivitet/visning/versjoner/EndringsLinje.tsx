import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';

import { formaterDatoEllerTidSiden } from '../../../../utils/dateUtils';
import { Endring } from '../../../../datatypes/Historikk';
import { hentBrukeravhengigTekst } from './brukeravhengigTekst';
import { useErVeileder } from '../../../../Provider';

export const EndringsLinje = ({ endring }: { endring: Endring }) => {
    const erBruker = !useErVeileder();
    const brukeravhengigTekst = (
        <Label className="inline">
            {hentBrukeravhengigTekst(erBruker, endring.endretAvType as any, endring.endretAv)}
        </Label>
    );
    return (
        <div className="pb-4">
            <>
                {brukeravhengigTekst} {erBruker ? endring.beskrivelseForBruker : endring.beskrivelseForVeileder}
            </>
            <BodyShort>{formaterDatoEllerTidSiden(endring.tidspunkt)}</BodyShort>
        </div>
    );
};
