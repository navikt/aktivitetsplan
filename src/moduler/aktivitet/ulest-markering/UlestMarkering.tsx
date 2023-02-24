import React from 'react';

import { CustomAlertstripe } from '../visning/hjelpekomponenter/CustomAlertstripe';
import styles from './UlestMarkering.module.less';

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
