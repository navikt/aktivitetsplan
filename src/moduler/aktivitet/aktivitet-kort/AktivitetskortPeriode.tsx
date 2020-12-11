import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { GRUPPE_AKTIVITET_TYPE, MOTE_TYPE, SAMTALEREFERAT_TYPE, STILLING_AKTIVITET_TYPE } from '../../../constant';
import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import { formaterDatoKortManed } from '../../../utils';
import Soknadfrist from './Soknadsfrist';

interface Props {
    aktivitet: Aktivitet;
    id: string;
}

function AktiviteskortPeriodeVisning({ aktivitet, id }: Props) {
    const { type, fraDato, tilDato } = aktivitet;

    if (type === STILLING_AKTIVITET_TYPE) {
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
            return `TIL: ${formatertTilDato}`;
        }

        if (!tilDato && fraDato) {
            return `FRA: ${formatertFraDato}`;
        }

        return [formatertFraDato, formatertTilDato].filter((dato) => dato).join(' - ');
    }
    return <Normaltekst id={id}>{periodeVisning()}</Normaltekst>;
}

export default AktiviteskortPeriodeVisning;
