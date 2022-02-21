import classNames from 'classnames';
import dayjs from 'dayjs';
import NavDatoVelger, { DatepickerProps } from 'nav-datovelger/lib/Datepicker';
import { Label, SkjemaelementFeilmelding } from 'nav-frontend-skjema';
import React, { useState } from 'react';

import { datePickerToISODate } from '../../../utils';
import { FieldStateInput } from '../input/inputTypes';
import styles from './Datovelger.module.less';

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
    labelClassName?: string;
    input: FieldStateInput;
    required?: boolean;
}

function DatovelgerWrapper(props: Props & Omit<DatepickerProps, 'inputProps' | 'onChange'>) {
    const { label, error, input, required, labelClassName } = props;
    const [touched, setTouched] = useState(false);
    const feil = error && touched ? error : undefined;

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

    const cls = classNames(styles.datovelger, { [styles.harFeil]: !!feil });
    const datovelgerInput = { ...input, placeholder: 'dd.mm.åååå', required };

    return (
        <div className={cls}>
            <Label htmlFor={input.id} className={labelClassName}>
                {label}
            </Label>
            <NavDatoVelger {...props} inputProps={datovelgerInput} onChange={_onChange} value={day} />
            <DatoFeil feil={feil} />
        </div>
    );
}

export default DatovelgerWrapper;
