import React, { PropTypes as PT } from 'react';
import { Field } from 'redux-form';
import DatePicker from 'nav-react-datepicker';
import moment from 'moment';

const datoFormat = 'DD.MM.YYYY';
function DateField({ name, label, required, disabled }) {
    function fraFormattertDatoTilISO(formattertDato) {
        const parsetDato = moment(formattertDato, datoFormat); // eslint-disable-line no-undef
        const isoDato = parsetDato.isValid() ? parsetDato.format() : '';
        return isoDato;
    }

    function fraISOTilDatoObjekt(isoStreng) {
        const dato = isoStreng ? moment(isoStreng) : undefined; // eslint-disable-line no-undef
        return dato;
    }

    function onBlur(e) {
        if (!moment(e.target.value, datoFormat, true).isValid()) { // eslint-disable-line no-undef
            e.target.value = ''; // eslint-disable-line no-param-reassign
        }
    }

    return (
        <Field
            name={name}
            type="date"
            parse={fraFormattertDatoTilISO}
            component={({ input }) => {
                const { value, onChange } = input;
                return (
                    <DatePicker
                        required={required}
                        disabled={disabled}
                        value={fraISOTilDatoObjekt(value)}
                        onChange={onChange}
                        onBlur={onBlur}
                    >{label}
                    </DatePicker>
                );
            }}
        />
    );
}

DateField.propTypes = {
    name: PT.string,
    label: PT.string,
    required: PT.bool,
    disabled: PT.bool
};

export default DateField;

