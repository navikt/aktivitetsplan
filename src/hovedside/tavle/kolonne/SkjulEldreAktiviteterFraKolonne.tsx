import React from 'react';
import { useSelector } from 'react-redux';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import loggEvent from '../../../felles-komponenter/utils/logging';
import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';
import { selectErVeileder } from '../../../moduler/identitet/identitet-selector';
import InvertedLestMer from './InvertedLesMer';

const LOGGING_VISELDREAKITIVITETER = 'aktivitetsplan.viseldreaktiviter';
const LOGGING_SKJULELDREAKTIVITETER = 'aktivitetsplan.skjuleldreaktiviter';

interface Props {
    aktiviteteterTilDatoMerEnnToManederSiden: AlleAktiviteter[];
}

const SkjulEldreAktiviteterFraKolonne = (props: Props) => {
    const erVeileder = useSelector(selectErVeileder);
    const aktiviteter = props.aktiviteteterTilDatoMerEnnToManederSiden;
    const hiden = aktiviteter.length === 0;

    const liste = aktiviteter.map((aktivitet) => <DragbartAktivitetskort key={aktivitet.id} aktivitet={aktivitet} />);

    return (
        <InvertedLestMer
            hidden={hiden}
            onOpen={() => loggEvent(LOGGING_VISELDREAKITIVITETER, { erVeileder })}
            onClose={() => loggEvent(LOGGING_SKJULELDREAKTIVITETER, { erVeileder })}
            apneTekst="Vis aktiviteter eldre enn 1 måned"
            lukkTekst="Skjul aktiviteter eldre enn 1 måned"
        >
            {liste}
        </InvertedLestMer>
    );
};

export default SkjulEldreAktiviteterFraKolonne;
