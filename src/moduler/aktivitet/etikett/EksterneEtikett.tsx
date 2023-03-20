import { Tag, TagProps } from '@navikt/ds-react';
import React from 'react';

import { EksternAktivitet, EksternAktivitetType } from '../../../datatypes/internAktivitetTypes';

interface EksternEtikett {
    tekst: string;
    variant: TagProps['variant'];
}

const arenaTiltakEtikettKodeMapper: Record<string, EksternEtikett | undefined> = {
    SOKT_INN: { tekst: 'Søkt inn på tiltaket', variant: 'info' },
    AVSLAG: { tekst: 'Fått avslag', variant: 'info' },
    IKKE_AKTUELL: { tekst: 'Ikke aktuell for tiltaket', variant: 'neutral' },
    IKKE_MOETT: { tekst: 'Ikke møtt på tiltaket', variant: 'warning' },
    INFOMOETE: { tekst: 'Infomøte før tiltaket', variant: 'info' },
    TAKKET_JA: { tekst: 'Takket ja til tilbud', variant: 'info' },
    TAKKET_NEI: { tekst: 'Takket nei til tilbud', variant: 'warning' },
    FATT_PLASS: { tekst: 'Fått plass på tiltaket', variant: 'info' },
    VENTELISTE: { tekst: 'På venteliste', variant: 'info' },
};

const getEtikettByKode = (type: EksternAktivitetType, kode: string): EksternEtikett | undefined => {
    switch (type) {
        case EksternAktivitetType.ARENA_TILTAK_TYPE:
            return arenaTiltakEtikettKodeMapper[kode];
        default:
            return undefined;
    }
};

interface Props {
    aktivitet: EksternAktivitet;
}

const EksterneEtiketter = ({ aktivitet }: Props) => {
    const { etiketter, type } = aktivitet.eksternAktivitet;

    if (!etiketter) return null;

    return (
        <>
            {etiketter
                .map((etikett) => getEtikettByKode(type, etikett.kode))
                .map((eksternEtikett, i) => {
                    return eksternEtikett ? (
                        <Tag variant={eksternEtikett.variant} size="small" key={i}>
                            {eksternEtikett.tekst}
                        </Tag>
                    ) : null;
                })}
        </>
    );
};

export default EksterneEtiketter;
