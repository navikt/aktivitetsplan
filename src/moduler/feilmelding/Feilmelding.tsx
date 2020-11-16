import classNames from 'classnames';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import React, { useState } from 'react';

import Knappelenke from '../../felles-komponenter/utils/knappelenke';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import { guid } from '../../utils';
import styles from './Feilmelding.module.less';
import FeilmeldingDetaljer from './FeilmeldingDetaljer';
import { FeilmeldingType } from './FeilmeldingTypes';
import { getErrorText } from './GetErrorText';

interface PropTypes {
    className?: string;
    feilmeldinger: FeilmeldingType[];
}

export default function Feilmelding(props: PropTypes) {
    const [apen, setApen] = useState(false);
    const { feilmeldinger, className } = props;

    if (feilmeldinger.length === 0) {
        return null;
    }

    const tekst = getErrorText(feilmeldinger);
    const toggleDetaljer = () => {
        setApen(!apen);
    };

    return (
        <div className={classNames(styles.feilmelding, className)}>
            <AlertStripeFeil> {tekst} </AlertStripeFeil>
            <Knappelenke onClick={toggleDetaljer} className="">
                <span>Vis detaljer</span>
            </Knappelenke>

            <VisibleIfDiv visible={apen} className="feilmelding__detaljer">
                {feilmeldinger.map((feil) => (
                    <FeilmeldingDetaljer feil={feil} key={guid()} />
                ))}
            </VisibleIfDiv>
        </div>
    );
}
