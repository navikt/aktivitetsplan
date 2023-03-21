import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import { GRUPPE_AKTIVITET_TYPE, MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';
import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { formaterDatoKortManed } from '../../../utils';
import Soknadfrist from './Soknadsfrist';

interface Props {
    aktivitet: AlleAktiviteter;
    id: string;
}

function AktiviteskortPeriodeVisning({ aktivitet, id }: Props) {
    const { type, fraDato, tilDato } = aktivitet;

    if (type === VeilarbAktivitetType.STILLING_FRA_NAV_TYPE) {
        return null;
    }

    if (type === VeilarbAktivitetType.STILLING_AKTIVITET_TYPE) {
        return <Soknadfrist aktivitet={aktivitet} />;
    }

    const formatertFraDato = formaterDatoKortManed(fraDato);
    const formatertTilDato = formaterDatoKortManed(tilDato);

    function periodeVisning() {
        if (type === MOTE_TYPE || type === SAMTALEREFERAT_TYPE) {
            return formatertFraDato;
        }

        if (type === GRUPPE_AKTIVITET_TYPE && formatertTilDato && formatertFraDato === formatertTilDato) {
            return formatertFraDato;
        }

        if (!fraDato && tilDato) {
            return `Til: ${formatertTilDato}`;
        }

        if (!tilDato && fraDato) {
            return `Fra: ${formatertFraDato}`;
        }

        return [formatertFraDato, formatertTilDato].filter((dato) => dato).join(' - ');
    }
    return <BodyShort id={id}>{periodeVisning()}</BodyShort>;
}

export default AktiviteskortPeriodeVisning;
