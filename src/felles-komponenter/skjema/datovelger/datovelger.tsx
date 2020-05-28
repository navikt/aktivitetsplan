import React, { useCallback } from 'react';
import { Label, SkjemaelementFeilmelding } from 'nav-frontend-skjema';
import Datovelger, { DatovelgerProps } from 'nav-datovelger/lib/Datovelger';
import { FieldStateInput } from '../input/utils';
import { datePickerToISODate, dateToDatePicker, erGyldigFormattertDato } from '../../../utils';
import styles from './datovelger.module.less';
import classNames from 'classnames';

function parseInputDate(dato?: string) {
    return erGyldigFormattertDato(dato) ? datePickerToISODate(dato) : dato;
}

function DatoFeil(props: { feil?: string }) {
    if (!props.feil) {
        return null;
    }
    return <SkjemaelementFeilmelding>{props.feil}</SkjemaelementFeilmelding>;
}

interface Props {
    touched: boolean;
    error?: string;
    label: string;
    input: FieldStateInput;
}

function DatovelgerWrapper(props: Props & DatovelgerProps) {
    const { label, touched, error, input } = props;
    const feil = error && touched ? error : undefined;

    const { onChange, name } = input;
    const _onChange = useCallback(
        (date?: string) => {
            const newValue = parseInputDate(date);
            const customEvent = {
                target: { name: name, value: newValue },
            };
            onChange(customEvent as any);
        },
        [name, onChange]
    );

    const valgtDato = dateToDatePicker(input.value);
    const cls = classNames(styles.datovelger, { [styles.harFeil]: !!feil });
    const datovelgerInput = { ...input, placeholder: 'dd.mm.åååå' };

    return (
        <div className={cls}>
            <Label htmlFor={input.id}>{label}</Label>
            <Datovelger {...props} input={datovelgerInput} onChange={_onChange} valgtDato={valgtDato} />
            <DatoFeil feil={feil} />
        </div>
    );
}

export default DatovelgerWrapper;
