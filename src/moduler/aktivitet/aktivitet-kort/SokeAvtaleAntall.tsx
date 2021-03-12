import React from 'react';

import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../constant';
import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';

interface Props {
    aktivitet: Aktivitet;
}

export default function SokeAvtaleAntall({ aktivitet }: Props) {
    const { antallStillingerSokes, antallStillingerIUken, type } = aktivitet;

    if (type !== SOKEAVTALE_AKTIVITET_TYPE) {
        return null;
    }

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
