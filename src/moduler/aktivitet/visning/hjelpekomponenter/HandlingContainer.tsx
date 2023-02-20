import { ChevronRightCircle } from '@navikt/ds-icons';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { useSelector } from 'react-redux';

import { LenkeMedType } from '../../../../datatypes/eksternAktivitetTypes';
import { EksternAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import DeleLinje from '../delelinje/delelinje';
import styles from '../underelement-for-aktivitet/dialog/Dialogunderelement.module.less';

interface Props {
    aktivitet: EksternAktivitet;
}

const LenkeSeksjon = (handling: LenkeMedType, erVeileder: boolean, i: number) => {
    if (handling.lenkeType === 'EKSTERN' && erVeileder) return null;
    if (handling.lenkeType === 'INTERN' && !erVeileder) return null;

    return (
        <div key={i}>
            <a target="_blank" rel="noopener noreferrer" href={handling.url} className={styles.dialogLinke}>
                <div>
                    <Element>{handling.tekst}</Element>
                    {handling.subtekst && <Normaltekst>{handling.subtekst}</Normaltekst>}
                </div>
                <div className={styles.dialogPil} aria-hidden>
                    <ChevronRightCircle />
                </div>
            </a>
            <DeleLinje />
        </div>
    );
};

const HandlingContainer = ({ aktivitet }: Props) => {
    const { handlinger } = aktivitet.eksternAktivitet;

    const erVeileder = useSelector(selectErVeileder);

    if (!handlinger) {
        return null;
    }

    return <section>{handlinger.map((handling, i) => LenkeSeksjon(handling, erVeileder, i))}</section>;
};

export default HandlingContainer;
