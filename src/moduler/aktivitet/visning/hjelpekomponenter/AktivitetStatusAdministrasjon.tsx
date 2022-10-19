import React from 'react';

import { VeilarbAktivitet, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import DeleLinje from '../delelinje/delelinje';
import OppdaterAktivitetEtikett from '../etikett-oppdatering/OppdaterAktivitetEtikett';
import OppdaterSoknadsstatus from '../soknadsstatus-oppdatering/OppdaterSoknadsstatus';
import OppdaterAktivitetStatus from '../status-oppdatering/oppdater-aktivitet-status';

interface Props {
    aktivitet: VeilarbAktivitet;
}

const AktivitetStatusAdministrasjon = ({ aktivitet }: Props) => {
    const type = aktivitet.type;
    const svartJaPaaStillingFraNav =
        type === VeilarbAktivitetType.STILLING_FRA_NAV_TYPE
            ? aktivitet.stillingFraNavData.cvKanDelesData?.kanDeles
            : false;

    return (
        <div>
            {type === VeilarbAktivitetType.STILLING_AKTIVITET_TYPE ? (
                <>
                    <OppdaterAktivitetEtikett aktivitet={aktivitet} />
                    <DeleLinje />
                </>
            ) : null}
            {type === VeilarbAktivitetType.STILLING_FRA_NAV_TYPE && svartJaPaaStillingFraNav ? (
                <>
                    <OppdaterSoknadsstatus aktivitet={aktivitet} />
                    <DeleLinje />
                </>
            ) : null}
            <OppdaterAktivitetStatus aktivitet={aktivitet} />
            <DeleLinje />
        </div>
    );
};

export default AktivitetStatusAdministrasjon;
