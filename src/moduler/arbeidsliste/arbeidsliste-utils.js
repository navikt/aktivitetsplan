import React from 'react';
import { rules } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import Moment from 'moment';

export const lagArbeidsliste = (fnr, form, props) => ({
    fnr,
    veilederId: props.veileder,
    kommentar: form.kommentar,
    frist: form.frist,
});

export const KOMMENTAR_MAKS_LENGDE = 255;
export const pakrevd = rules.minLength(
    0,
    <FormattedMessage id="arbeidsliste.feilmelding.for-kort" />
);
export const pakrevdFrist = rules.minLength(
    0,
    <FormattedMessage id="arbeidsliste.feilmelding.angi.frist" />
);
export const begrensetKommentarLengde = rules.maxLength(
    KOMMENTAR_MAKS_LENGDE,
    <FormattedMessage
        id="arbeidsliste-form.feilmelding.kommentar-lengde"
        values={{ KOMMENTAR_MAKS_LENGDE }}
    />
);

export function fristErEtterIDag(value) {
    return Moment(value).isAfter(
        Moment().subtract(1, 'day').startOf('day'),
        'd'
    )
        ? undefined
        : <FormattedMessage id="arbeidsliste-form.feilmeleding.frist.etter" />;
}
