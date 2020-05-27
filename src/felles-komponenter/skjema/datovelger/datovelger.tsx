import React from 'react';
import { Label, SkjemaGruppe } from 'nav-frontend-skjema';
import Datovelger, { DatovelgerProps } from 'nav-datovelger/lib/Datovelger';
import { FieldStateInput } from '../input/utils';
import { datePickerToISODate, dateToDatePicker, erGyldigFormattertDato, ISODateToDatePicker } from '../../../utils';
import styles from './datovelger.module.less';
import classNames from 'classnames';

function parseInputDate(dato?: string) {
    return erGyldigFormattertDato(dato) ? datePickerToISODate(dato) : dato;
}

interface Props {
    touched: boolean;
    error?: string;
    label: string;
    input: FieldStateInput;
    pristine?: boolean;
    initialValue?: string;
}

function BasicDatovelger(props: Props & DatovelgerProps) {
    const { label, touched, error, input, pristine, initialValue, ...rest } = props;
    const feil = error && touched ? error : undefined;

    const onChange = (date?: string) => {
        const newValue = parseInputDate(date);
        const customEvent = {
            target: { name: input.name, value: newValue },
        };
        input.onChange(customEvent as any);
    };

    const valgtDato = dateToDatePicker(input.value);
    const cls = classNames(styles.datovelger, { [styles.harFeil]: !!feil });
    const datovelgerInput = { ...input, placeholder: 'dd.mm.åååå' };

    return (
        <SkjemaGruppe className={cls} feil={feil}>
            <Label htmlFor={input.id}>{label}</Label>
            <Datovelger {...props} input={datovelgerInput} onChange={onChange} valgtDato={valgtDato} />
        </SkjemaGruppe>
    );
}

export default BasicDatovelger;
