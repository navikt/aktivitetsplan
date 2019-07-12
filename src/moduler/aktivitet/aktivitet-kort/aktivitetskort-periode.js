import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { injectIntl, intlShape } from 'react-intl';

import {
    GRUPPE_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
} from '../../../constant';
import { formaterDato } from '../../../utils';
import * as PT from '../../../proptypes';

function AktiviteskortPeriodeVisning({ aktivitet, intl }) {
    const { id, type, fraDato, tilDato } = aktivitet;
    const formatertFraDato = formaterDato(fraDato);
    const formatertTilDato = formaterDato(tilDato);

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
