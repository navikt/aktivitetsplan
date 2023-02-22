import { Next } from '@navikt/ds-icons';
import { BodyShort, Label } from '@navikt/ds-react';
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
                    <Label>{handling.tekst}</Label>
                    {handling.subtekst && <BodyShort>{handling.subtekst}</BodyShort>}
                </div>
                <div className={styles.dialogPil} aria-hidden>
                    <Next />
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
