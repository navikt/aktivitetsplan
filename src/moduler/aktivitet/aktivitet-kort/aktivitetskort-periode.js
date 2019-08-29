import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { injectIntl, intlShape } from 'react-intl';

import {
    GRUPPE_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    STILLING_AKTIVITET_TYPE,
} from '../../../constant';
import { formaterDatoKortManed } from '../../../utils';
import * as PT from '../../../proptypes';
import Soknadfrist from './Soknadsfrist';

function AktiviteskortPeriodeVisning({ aktivitet, intl }) {
    const { id, type, fraDato, tilDato } = aktivitet;

    if (type === STILLING_AKTIVITET_TYPE) {
        return <Soknadfrist aktivitet={aktivitet} />;
    }

    const formatertFraDato = formaterDatoKortManed(fraDato);
    const formatertTilDato = formaterDatoKortManed(tilDato);

    function periodeVisning() {
        if (type === MOTE_TYPE || type === SAMTALEREFERAT_TYPE) {
            return formatertFraDato;
        }

        if (
            type === GRUPPE_AKTIVITET_TYPE &&
            formatertTilDato &&
            formatertFraDato === formatertTilDato
        ) {
            return formatertFraDato;
        }

        if (!fraDato && tilDato) {
            const tilDatoValues = {
                label: 'TIL',
                DATO: formatertTilDato,
            };

            return intl.formatMessage(
                {
                    id: 'aktivitetkort.dato_label',
                },
                tilDatoValues
            );
        }

        if (!tilDato && fraDato) {
            const fraDatoValues = {
                label: 'FRA',
                DATO: formatertFraDato,
            };

            return intl.formatMessage(
                { id: 'aktivitetkort.dato_label' },
                fraDatoValues
            );
        }

        return [formatertFraDato, formatertTilDato]
            .filter(dato => dato)
            .join(' - ');
    }
    return (
        <Normaltekst id={`aktivitetskort__dato__${id}`}>
            {periodeVisning()}
        </Normaltekst>
    );
}

AktiviteskortPeriodeVisning.propTypes = {
    aktivitet: PT.aktivitet.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(AktiviteskortPeriodeVisning);
