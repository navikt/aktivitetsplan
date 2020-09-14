import React from 'react';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../constant';
import * as AppPT from '../../../proptypes';

export default function SokeAvtaleAntall({ aktivitet }) {
    const { antallStillingerSokes, antallStillingerIUken, type } = aktivitet;
    if (type !== SOKEAVTALE_AKTIVITET_TYPE) {
        return null;
    }

    return (
        <div>
            <VisibleIfDiv visible={antallStillingerSokes > 0}>
                Antall søknader i perioden &nbsp;
                {antallStillingerSokes}
            </VisibleIfDiv>
            <VisibleIfDiv visible={antallStillingerIUken > 0}>
                Antall søknader i uken &nbsp;
                {antallStillingerIUken}
            </VisibleIfDiv>
        </div>
    );
}

SokeAvtaleAntall.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};
