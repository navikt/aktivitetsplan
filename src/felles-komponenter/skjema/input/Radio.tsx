import { Radio as NavRadio } from '@navikt/ds-react';
import React from 'react';

interface RadioProps {
    className?: string;
    value: string;
    label: React.ReactNode;
    id?: string;
}

// pristine and initialValue isn't used, but we don't want to pass it to input
const Radio = (props: RadioProps) => {
    const { value, label, className, id } = props;
    return (
        <NavRadio className={className} value={value} id={id || `id--${value}`}>
            {label}
        </NavRadio>
    );
};
export default Radio;
