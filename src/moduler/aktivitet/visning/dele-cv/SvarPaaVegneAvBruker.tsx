import { FieldState } from '@nutgaard/use-formstate';
import classNames from 'classnames';
import Panel from 'nav-frontend-paneler';
import { Label } from 'nav-frontend-skjema';
import { Element as NavElement } from 'nav-frontend-typografi';
import React from 'react';
import { useSelector } from 'react-redux';

import EtikettBase from '../../../../felles-komponenter/etikett-base/EtikettBase';
import { DatoFeil, DatovelgerWrapperBase } from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
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
                <Label className={styles.label} htmlFor={formhandler.input.id}>
                    Når var du i dialog med brukeren om å dele CV-en deres med denne arbeidsgiveren?
                </Label>
                <DatovelgerWrapperBase input={formhandler.input} error={!!feil} required={false} />
            </Panel>
            <DatoFeil feil={formhandler.touched ? formhandler.error : undefined} />
        </div>
    );
};
