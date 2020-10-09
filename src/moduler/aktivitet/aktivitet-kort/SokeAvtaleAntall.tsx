import React from 'react';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../constant';
import { Aktivitet } from '../../../types';

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
            <VisibleIfDiv visible={antallStillingerSokes && antallStillingerSokes > 0}>
                Antall søknader i perioden &nbsp;
                {antallStillingerSokes}
            </VisibleIfDiv>
            <VisibleIfDiv visible={antallStillingerIUken && antallStillingerIUken > 0}>
                Antall søknader i uken &nbsp;
                {antallStillingerIUken}
            </VisibleIfDiv>
        </div>
    );
}
