import React from 'react';

import { SokeavtaleAktivitet } from '../../../datatypes/internAktivitetTypes';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';

interface Props {
    aktivitet: SokeavtaleAktivitet;
}

export default function SokeAvtaleAntall({ aktivitet }: Props) {
    const { antallStillingerSokes, antallStillingerIUken } = aktivitet;

    return (
        <div>
            <VisibleIfDiv visible={!!antallStillingerSokes && antallStillingerSokes > 0}>
                Antall søknader i perioden {antallStillingerSokes}
            </VisibleIfDiv>
            <VisibleIfDiv visible={!!antallStillingerIUken && antallStillingerIUken > 0}>
                Antall søknader i uken {antallStillingerIUken}
            </VisibleIfDiv>
        </div>
    );
}
