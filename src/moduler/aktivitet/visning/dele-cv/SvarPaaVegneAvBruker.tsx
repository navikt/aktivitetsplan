import { FieldState } from '@nutgaard/use-formstate';
import Panel from 'nav-frontend-paneler';
import React from 'react';
import { useSelector } from 'react-redux';

import EtikettBase from '../../../../felles-komponenter/etikett-base/EtikettBase';
import DatovelgerWrapper, { DatoFeil } from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import styles from './SvarPaaVegneAvBruker.module.less';

interface Props {
    formhandler: FieldState;
}

export const SvarPaaVegneAvBruker = ({ formhandler }: Props) => {
    const erVeileder = useSelector(selectErVeileder);

    if (!erVeileder) return null;

    const overskrift = 'Svar på vegne av brukeren';
    const ingress = 'Når var du i dialog med brukeren om å dele CV-en deres med denne arbeidsgiveren?';

    const Tittel = () => <p>{overskrift}</p>;

    return (
        <div>
            <EtikettBase className={styles.etikett}>FOR NAV-ANSATT</EtikettBase>
            <Panel border>
                <Tittel />
                <DatovelgerWrapper input={formhandler.input} label={ingress} />
            </Panel>
            <DatoFeil feil={formhandler.touched ? formhandler.error : undefined} />
        </div>
    );
};
