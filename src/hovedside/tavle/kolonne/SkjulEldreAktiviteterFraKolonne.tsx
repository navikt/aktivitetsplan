import React from 'react';

import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import loggEvent from '../../../felles-komponenter/utils/logging';
import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';
import { useErVeileder } from '../../../Provider';
import InvertedLestMer from './InvertedLesMer';

const LOGGING_VISELDREAKITIVITETER = 'aktivitetsplan.viseldreaktiviter';
const LOGGING_SKJULELDREAKTIVITETER = 'aktivitetsplan.skjuleldreaktiviter';

interface Props {
    aktiviteteterTilDatoMerEnnToManederSiden: AlleAktiviteter[];
    aktivitetTekst: string;
    status: AktivitetStatus;
    startIndex: number;
}

const SkjulEldreAktiviteterFraKolonne = (props: Props) => {
    const erVeileder = useErVeileder();
    const aktiviteter = props.aktiviteteterTilDatoMerEnnToManederSiden;
    const hidden = aktiviteter.length === 0;
    const { aktivitetTekst } = props;

    const liste = aktiviteter.map((aktivitet, index) => (
        <DragbartAktivitetskort
            key={aktivitet.id}
            aktivitet={aktivitet}
            group={props.status}
            index={props.startIndex + index}
        />
    ));

    return (
        <InvertedLestMer
            hidden={hidden}
            onOpen={() => loggEvent(LOGGING_VISELDREAKITIVITETER, { erVeileder })}
            onClose={() => loggEvent(LOGGING_SKJULELDREAKTIVITETER, { erVeileder })}
            apneTekst={`Vis ${aktivitetTekst}`}
            lukkTekst={`Skjul ${aktivitetTekst}`}
        >
            {liste}
        </InvertedLestMer>
    );
};

export default SkjulEldreAktiviteterFraKolonne;
