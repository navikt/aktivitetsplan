import { Radio as NavRadio } from '@navikt/ds-react';
/* eslint-disable no-unused-vars */
import React from 'react';

interface RadioProps {
    className?: string;
    disabled?: boolean;
    value: string;
    label: React.ReactNode;
    id?: string;
}

// pristine and initialValue isn't used, but we don't want to pass it to input
const Radio = (props: RadioProps) => {
    const { value, label, disabled, className, id } = props;
    return (
        <NavRadio className={className} disabled={disabled} value={value} id={id || `id--${value}`}>
            {label}
        </NavRadio>
    );
};
export default Radio;
