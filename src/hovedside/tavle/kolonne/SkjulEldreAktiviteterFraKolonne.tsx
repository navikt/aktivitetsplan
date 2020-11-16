import React from 'react';
import { useSelector } from 'react-redux';

import loggEvent from '../../../felles-komponenter/utils/logging';
import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';
import { selectErVeileder } from '../../../moduler/identitet/identitet-selector';
import { Aktivitet } from '../../../types';
import InvertedLestMer from './InvertedLesmer';

const LOGGING_VISELDREAKITIVITETER = 'aktivitetsplan.viseldreaktiviter';
const LOGGING_SKJULELDREAKTIVITETER = 'aktivitetsplan.skjuleldreaktiviter';

interface Props {
    aktiviteteterTilDatoMerEnnToManederSiden: Aktivitet[];
}

function SkjulEldreAktiviteter(props: Props) {
    const erVeileder = useSelector(selectErVeileder);
    const aktiviteter = props.aktiviteteterTilDatoMerEnnToManederSiden;
    const hiden = aktiviteter.length === 0;

    const liste = aktiviteter.map((aktivitet) => <DragbartAktivitetskort key={aktivitet.id} aktivitet={aktivitet} />);

    return (
        <InvertedLestMer
            hidden={hiden}
            onOpen={() => loggEvent(LOGGING_VISELDREAKITIVITETER, { erVeileder })}
            onClose={() => loggEvent(LOGGING_SKJULELDREAKTIVITETER, { erVeileder })}
            apneTekst="Vis kort eldre enn 1 måned"
            lukkTekst="Skjul kort eldre enn 1 måned"
        >
            {liste}
        </InvertedLestMer>
    );
}

export default SkjulEldreAktiviteter;
