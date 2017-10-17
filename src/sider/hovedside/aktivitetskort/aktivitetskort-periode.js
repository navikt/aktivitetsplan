import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { injectIntl, intlShape } from 'react-intl';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';
import { formaterDato } from '../../../utils';
import * as PT from '../../../proptypes';

function AktiviteskortPeriodeVisning({ aktivitet, intl }) {
    const { type, fraDato, tilDato } = aktivitet;
    function periodeVisning() {
        if (type === MOTE_TYPE || type === SAMTALEREFERAT_TYPE) {
            return formaterDato(fraDato);
        }
        if (!fraDato && tilDato) {
            const tilDatoValues = {
                label: 'TIL',
                DATO: formaterDato(tilDato),
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
                DATO: formaterDato(fraDato),
            };

            return intl.formatMessage(
                { id: 'aktivitetkort.dato_label' },
                fraDatoValues
            );
        }

        return [formaterDato(fraDato), formaterDato(tilDato)].filter(dato => dato).join(' - ');
    }
    return (
        <Normaltekst className="aktivitetskort__dato">
            {periodeVisning()}
        </Normaltekst>
    );
}

AktiviteskortPeriodeVisning.propTypes = {
    aktivitet: PT.aktivitet.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(AktiviteskortPeriodeVisning);
