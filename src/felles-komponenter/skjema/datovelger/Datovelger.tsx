import classNames from 'classnames';
import { format, parseISO, startOfDay } from 'date-fns';
// import NavDatoVelger, { DatepickerProps } from 'nav-datovelger/lib/Datepicker';
import React, { useState } from 'react';

import { datePickerToISODate, erGyldigISODato } from '../../../utils';
import { FieldStateInput } from '../input/inputTypes';
import styles from './Datovelger.module.less';

function DatoFeil(props: { feil?: string }) {
    if (!props.feil) {
        return null;
    }
    return <p className="text-red-700 font-bold">{props.feil}</p>;
}

interface Props {
    touched: boolean;
    error?: string;
    label: string;
    labelClassName?: string;
    input: FieldStateInput;
    required?: boolean;
}

function DatovelgerWrapper(props: Props & Record<any, any>) {
    const { label, error, input, required, labelClassName } = props;
    const [touched, setTouched] = useState(false);
    const feil = error && touched ? error : undefined;

    const { onChange, name } = input;
    const _onChange = (date?: string) => {
        const newValue = datePickerToISODate(date);
        const customEvent: any = {
            target: { name: name, value: newValue ? newValue : date },
        };
        onChange(customEvent);
        setTouched(true);
    };

    const day = erGyldigISODato(input.value) ? format(startOfDay(parseISO(input.value)), 'yyyy-MM-dd') : input.value;

    const cls = classNames(styles.datovelger, { [styles.harFeil]: !!feil });
    const datovelgerInput = { ...input, placeholder: 'dd.mm.åååå', required };

    return (
        <div className={cls}>
            <label htmlFor={input.id} className={labelClassName}>
                {label}
            </label>
            {/*<NavDatoVelger {...props} inputProps={datovelgerInput} onChange={_onChange} value={day} />*/}
            <DatoFeil feil={feil} />
        </div>
    );
}

export default DatovelgerWrapper;
