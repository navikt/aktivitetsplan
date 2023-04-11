import React from 'react';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import loggEvent from '../../../felles-komponenter/utils/logging';
import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';
import { useErVeileder } from '../../../Provider';
import InvertedLestMer from './InvertedLesMer';

const LOGGING_VISELDREAKITIVITETER = 'aktivitetsplan.viseldreaktiviter';
const LOGGING_SKJULELDREAKTIVITETER = 'aktivitetsplan.skjuleldreaktiviter';

interface Props {
    aktiviteteterTilDatoMerEnnToManederSiden: AlleAktiviteter[];
    aktivitetTekst: string;
}

const SkjulEldreAktiviteterFraKolonne = (props: Props) => {
    const erVeileder = useErVeileder();
    const aktiviteter = props.aktiviteteterTilDatoMerEnnToManederSiden;
    const hidden = aktiviteter.length === 0;
    const { aktivitetTekst } = props;

    const liste = aktiviteter.map((aktivitet) => <DragbartAktivitetskort key={aktivitet.id} aktivitet={aktivitet} />);

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
