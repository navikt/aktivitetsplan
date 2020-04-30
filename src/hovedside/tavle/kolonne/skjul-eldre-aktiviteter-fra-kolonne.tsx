import React from 'react';
import { useSelector } from 'react-redux';
import PT from 'prop-types';
import { selectErVeileder } from '../../../moduler/identitet/identitet-selector';
import loggEvent from '../../../felles-komponenter/utils/logging';
import AktivitetsKort from '../../../moduler/aktivitet/aktivitet-kort/aktivitetskort';
import InvertedLestMer from './InvertedLesmer';
import { Aktivitet } from '../../../types';

const LOGGING_VISELDREAKITIVITETER = 'aktivitetsplan.viseldreaktiviter';
const LOGGING_SKJULELDREAKTIVITETER = 'aktivitetsplan.skjuleldreaktiviter';

interface AktivitetListeProps {
    aktiviteter: Aktivitet[];
}

function AktivitetsListe(props: AktivitetListeProps) {
    const liste = props.aktiviteter.map((aktivitet) => <AktivitetsKort key={aktivitet.id} aktivitet={aktivitet} />);
    return <> {liste} </>;
}

interface Props {
    aktiviteteterTilDatoMerEnnToManederSiden: Aktivitet[];
}

function SkjulEldreAktiviteter(props: Props) {
    const erVeileder = useSelector(selectErVeileder);
    const aktiviteter = props.aktiviteteterTilDatoMerEnnToManederSiden;
    const hiden = aktiviteter.length === 0;

    return (
        <InvertedLestMer
            hidden={hiden}
            onOpen={() => loggEvent(LOGGING_VISELDREAKITIVITETER, { erVeileder })}
            onClose={() => loggEvent(LOGGING_SKJULELDREAKTIVITETER, { erVeileder })}
            apneTekst="Vis kort eldre enn 1 måned"
            lukkTekst="Skjul kort eldre enn 1 måned"
        >
            <AktivitetsListe aktiviteter={aktiviteter} />
        </InvertedLestMer>
    );
}

SkjulEldreAktiviteter.propTypes = {
    aktiviteteterTilDatoMerEnnToManederSiden: PT.arrayOf(PT.object).isRequired,
};

export default SkjulEldreAktiviteter;
