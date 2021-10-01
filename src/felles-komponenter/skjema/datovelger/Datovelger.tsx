import classNames from 'classnames';
import dayjs from 'dayjs';
import Datovelger, { DatepickerProps } from 'nav-datovelger/lib/Datepicker';
import { Label, SkjemaelementFeilmelding } from 'nav-frontend-skjema';
import React, { useState } from 'react';

import { datePickerToISODate } from '../../../utils';
import { FieldStateInput } from '../input/inputTypes';
import styles from './datovelger.module.less';

export function DatoFeil(props: { feil?: string }) {
    if (!props.feil) {
        return null;
    }
    return <SkjemaelementFeilmelding>{props.feil}</SkjemaelementFeilmelding>;
}

interface BaseDatePickerProps extends Omit<DatepickerProps, 'inputProps' | 'onChange'> {}

interface Props {
    error?: string;
    label: string;
    input: FieldStateInput;
    required?: boolean;
}

function DatovelgerWrapper(props: Props & BaseDatePickerProps) {
    const { label, error, input } = props;
    const [touched, setTouched] = useState(false);
    const feil = error && touched ? error : undefined;

    const cls = classNames(styles.datovelger, { [styles.harFeil]: !!feil });

    return (
        <div className={cls}>
            <Label htmlFor={input.id}>{label}</Label>
            <DatovelgerWrapperInternal {...props} error={!!error} touched={touched} setTouched={setTouched} />
            <DatoFeil feil={feil} />
        </div>
    );
}

interface BaseProps extends BaseDatePickerProps {
    input: FieldStateInput;
    required?: boolean;
    error?: boolean;
}

export function DatovelgerWrapperBase(props: BaseProps) {
    const [touched, setTouched] = useState(false);
    return <DatovelgerWrapperInternal {...props} touched={touched} setTouched={setTouched} />;
}

interface InternalProps {
    input: FieldStateInput;
    required?: boolean;
    error?: boolean;
    touched: boolean;
    setTouched: (touched: boolean) => void;
}

function DatovelgerWrapperInternal(props: InternalProps & Omit<DatepickerProps, 'inputProps' | 'onChange'>) {
    const { input, required, error, touched, setTouched } = props;

    const feil = error && touched;

    const { onChange, name } = input;
    const _onChange = (date?: string) => {
        const newValue = datePickerToISODate(date);
        const customEvent: any = {
            target: { name: name, value: newValue },
        };
        onChange(customEvent);
        setTouched(true);
    };

    const day = input.value ? dayjs(input.value).startOf('day').format('YYYY-MM-DD') : '';

    const cls = classNames({ [styles.harFeil]: feil });
    const datovelgerInput = { ...input, placeholder: 'dd.mm.åååå', required };

    return (
        <div className={cls}>
            <Datovelger {...props} inputProps={datovelgerInput} onChange={_onChange} value={day} />
        </div>
    );
}

export default DatovelgerWrapper;
