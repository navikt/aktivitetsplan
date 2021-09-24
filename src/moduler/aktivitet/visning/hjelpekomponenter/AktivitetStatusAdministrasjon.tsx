import React from 'react';

import { STILLING_AKTIVITET_TYPE, STILLING_FRA_NAV_TYPE } from '../../../../constant';
import { Aktivitet, AktivitetType } from '../../../../datatypes/aktivitetTypes';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import DeleLinje from '../delelinje/delelinje';
import OppdaterAktivitetEtikett from '../etikett-oppdatering/OppdaterAktivitetEtikett';
import OppdaterSoknadsstatus from '../soknadsstatus-oppdatering/OppdaterSoknadsstatus';
import OppdaterAktivitetStatus from '../status-oppdatering/oppdater-aktivitet-status';

interface Props {
    type: AktivitetType;
    aktivitet: Aktivitet;
}

const AktivitetStatusAdministrasjon = (props: Props) => {
    const svartJaPaaStillingFraNav = !!props.aktivitet.stillingFraNavData?.cvKanDelesData?.kanDeles;

    return (
        <div>
            <VisibleIfDiv visible={props.type === STILLING_AKTIVITET_TYPE}>
                <OppdaterAktivitetEtikett aktivitet={props.aktivitet} />
                <DeleLinje />
            </VisibleIfDiv>
            <VisibleIfDiv visible={props.type === STILLING_FRA_NAV_TYPE && svartJaPaaStillingFraNav}>
                <OppdaterSoknadsstatus aktivitet={props.aktivitet} />
                <DeleLinje />
            </VisibleIfDiv>
            <OppdaterAktivitetStatus aktivitet={props.aktivitet} />
            <DeleLinje />
        </div>
    );
};

export default AktivitetStatusAdministrasjon;
