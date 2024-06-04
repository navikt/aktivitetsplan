import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import { formaterDatoEllerTidSiden } from '../../../../utils/dateUtils';
import { Endring } from '../../../../datatypes/Historikk';
import { useErVeileder } from '../../../../Provider';

const isUpperCase = (s: string) => s.toUpperCase() === s;

export const EndringsLinje = ({ endring }: { endring: Endring }) => {
    const erBruker = !useErVeileder();

    const beskrivelse = erBruker ? endring.beskrivelseForBruker : endring.beskrivelseForVeileder;

    const splittet = beskrivelse.split(' ').reduce(
        (result, current) => {
            const starterMedUppercase = isUpperCase(current.charAt(0));
            const erPåStartenAvSetningen = result[1].length === 0;
            if (starterMedUppercase && erPåStartenAvSetningen) {
                return [`${result[0]} ${current}`, result[1]];
            } else {
                return [result[0], `${result[1]} ${current}`];
            }
        },
        ['', ''],
    );

    return (
        <div className="pb-4">
            <b>{splittet[0]}</b> {splittet[1]}
            <BodyShort>{formaterDatoEllerTidSiden(endring.tidspunkt)}</BodyShort>
        </div>
    );
};
