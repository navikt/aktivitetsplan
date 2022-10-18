import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { flyttetAktivitetMetrikk } from '../../../../felles-komponenter/utils/logging';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { flyttAktivitetMedBegrunnelse } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import { selectKanEndreAktivitetStatus } from '../../aktivitetlisteSelector';
import EndreLinje from '../endre-linje/endre-linje';
import AktivitetStatusForm from './AktivitetStatusForm';
import StatusVisning from './status-visning';

const useDisableStatusEndring = (aktivitet: VeilarbAktivitet) => {
    const lasterAktivitet = useSelector(selectLasterAktivitetData);
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const kanEndreAktivitet = useSelector((state) => selectKanEndreAktivitetStatus(state, aktivitet));

    return lasterAktivitet || !underOppfolging || !kanEndreAktivitet;
};

const lagreStatusEndringer = (
    dispatch: Dispatch,
    values: { aktivitetstatus: AktivitetStatus; begrunnelse?: string },
    aktivitet: VeilarbAktivitet
) => {
    if (values.aktivitetstatus === aktivitet.status) {
        return Promise.resolve();
    }

    flyttetAktivitetMetrikk('submit', aktivitet, values.aktivitetstatus);
    return dispatch<any>(flyttAktivitetMedBegrunnelse(aktivitet, values.aktivitetstatus, values.begrunnelse));
};

interface OppdaterAktivitetStatusProps {
    aktivitet: VeilarbAktivitet;
}

function OppdaterAktivitetStatus(props: OppdaterAktivitetStatusProps) {
    const { aktivitet } = props;
    const [endring, setEndring] = useState(false);
    const dispatch = useDispatch();
    const disableStatusEndring = useDisableStatusEndring(aktivitet);

    const onSubmit = (val: any): Promise<any> =>
        lagreStatusEndringer(dispatch, val, aktivitet).then(() => {
            setEndring(false);
            // @ts-ignore
            document.querySelector('.aktivitet-modal').focus();
        });

    const visning = <StatusVisning status={aktivitet.status} />;
    const form = <AktivitetStatusForm disabled={disableStatusEndring} onSubmit={onSubmit} aktivitet={aktivitet} />;

    const kanEndre = aktivitet.status !== STATUS_FULLFOERT && aktivitet.status !== STATUS_AVBRUTT;

    return (
        <EndreLinje
            tittel="Hva er status på aktiviteten?"
            endring={endring}
            setEndring={setEndring}
            visning={visning}
            form={form}
            kanEndre={kanEndre}
        />
    );
}

export default OppdaterAktivitetStatus;
