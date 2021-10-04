import { FieldState } from '@nutgaard/use-formstate';
import classNames from 'classnames';
import Panel from 'nav-frontend-paneler';
import { Element as NavElement } from 'nav-frontend-typografi';
import React from 'react';
import { useSelector } from 'react-redux';

import EtikettBase from '../../../../felles-komponenter/etikett-base/EtikettBase';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import styles from './SvarPaaVegneAvBruker.module.less';

interface Props {
    formhandler: FieldState;
}

export const SvarPaaVegneAvBruker = ({ formhandler }: Props) => {
    const erVeileder = useSelector(selectErVeileder);

    if (!erVeileder) return null;

    const feil = formhandler.touched && formhandler.error;
    const cls = classNames(styles.svarPaaVegneAvBruker, { [styles.feil]: !!feil });
    return (
        <div className={cls}>
            <EtikettBase className={styles.etikett}>FOR NAV-ANSATT</EtikettBase>
            <Panel border className={styles.panel}>
                <NavElement>Svar på vegne av brukeren</NavElement>
                <DatoField
                    labelClassName={styles.label}
                    label="Når var du i dialog med brukeren om å dele CV-en deres med denne arbeidsgiveren? *"
                    {...formhandler}
                    required
                />
            </Panel>
        </div>
    );
};
