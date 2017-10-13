import moment from 'moment';
import { toDatePrettyPrint, erGyldigISODato } from '../../../utils';

// eslint-disable-next-line import/prefer-default-export
export function validerDatoField(input, intl, alternativer) {
    const { fra, til } = alternativer;
    const inputDato = moment(input);

    const fraDato = moment(fra);
    const tilDato = moment(til);

    if (input && !erGyldigISODato(input)) {
        return intl.formatMessage({
            id: 'datepicker.feilmelding.ugyldig-dato',
        });
    } else if (
        fra &&
        til &&
        (inputDato.isAfter(tilDato, 'day') || fraDato.isAfter(inputDato, 'day'))
    ) {
        tilDato.add(1, 'day');
        fraDato.subtract(1, 'day');

        const msgValues = {
            fradato: toDatePrettyPrint(fraDato.toDate()),
            tildato: toDatePrettyPrint(tilDato.toDate()),
        };
        return intl.formatMessage(
        {id: 'datepicker.feilmelding.innenfor-periode'}, msgValues,
        );
    }
    return undefined;
}
