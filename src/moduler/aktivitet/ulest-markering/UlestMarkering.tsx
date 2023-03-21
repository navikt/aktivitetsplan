import React from 'react';

import { CustomAlertstripe } from '../visning/hjelpekomponenter/CustomAlertstripe';

interface Props {
    hidden: boolean;
}
const UlestMarkering = (props: Props) => {
    const { hidden } = props;

    if (hidden) {
        return null;
    }

    return <CustomAlertstripe tekst="Ulest" />;
};

export default UlestMarkering;
