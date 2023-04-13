import { Alert, Heading } from '@navikt/ds-react';
import React from 'react';

import { AktivitetStatus, Livslopsstatus } from '../../../../datatypes/aktivitetTypes';
import { formaterDatoManed } from '../../../../utils/dateUtils';
import { overskrift } from './tekster';

const getTekst = (
    status: AktivitetStatus,
    livslopsstatus: Livslopsstatus,
    erHistorisk: boolean,
    svarfrist: string
): string => {
    if (status === AktivitetStatus.AVBRUTT && livslopsstatus === Livslopsstatus.AVBRUTT_AV_SYSTEM) {
        return `Du kan ikke svare på spørsmålet fordi svarfristen gikk ut ${formaterDatoManed(svarfrist)}`;
    }

    if (status === AktivitetStatus.AVBRUTT) {
        return `Du kan ikke svare på spørsmålet fordi aktiviteten er avbrutt`;
    }

    if (status === AktivitetStatus.FULLFOERT) {
        return `Du kan ikke svare på spørsmålet fordi aktiviteten er fullført`;
    }

    if (erHistorisk) {
        return 'Du kan ikke svare på spørsmålet fordi oppfølgingsperioden er avsluttet';
    }

    return 'Noe er feil, kontakt brukerstøtte';
};

interface Props {
    status: AktivitetStatus;
    livslopsstatus: Livslopsstatus;
    erHistorisk: boolean;
    svarfrist: string;
}

export const DeleCVAvbruttVisning = (props: Props) => {
    const { status, livslopsstatus, erHistorisk, svarfrist } = props;

    const tekst = getTekst(status, livslopsstatus, erHistorisk, svarfrist);

    return (
        <div className="p-4 bg-surface-subtle border-border-default border rounded-md">
            <Heading size="medium" className="mb-4">
                {overskrift}
            </Heading>
            <Alert variant="info" inline>
                {tekst}
            </Alert>
        </div>
    );
};
