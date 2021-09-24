import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import { Aktivitet, StillingFraNavSoknadsstatus } from '../../../../datatypes/aktivitetTypes';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { oppdaterSoknadsstatus } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import SoknadsstatusEtikett from '../../etikett/SoknadsstatusEtikett';
import EndreLinje from '../endre-linje/endre-linje';
import SoknadsstatusForm from './SoknadsstatusForm';

const useDisableSoknadsstatusEndring = (aktivitet: Aktivitet) => {
    const { historisk } = aktivitet;
    const lasterAktivitet = useSelector(selectLasterAktivitetData);
    const erUnderOppfolging = useSelector(selectErUnderOppfolging);
    const kanEndreAktivitet = !historisk;

    return lasterAktivitet || !erUnderOppfolging || !kanEndreAktivitet;
};

const lagreSoknadsstatus = (dispatch: Dispatch, value: SoknadsstatusValue, aktivitet: Aktivitet): Promise<any> => {
    const { soknadsstatus } = value;

    if (soknadsstatus === aktivitet.stillingFraNavData?.soknadsstatus) {
        return Promise.resolve();
    }

    return oppdaterSoknadsstatus(aktivitet.id, aktivitet.versjon, soknadsstatus)(dispatch);
};

interface Props {
    aktivitet: Aktivitet;
}

interface SoknadsstatusValue {
    soknadsstatus: StillingFraNavSoknadsstatus;
}

const OppdaterSoknadsstatus = (props: Props) => {
    const { aktivitet } = props;
    const [endring, setEndring] = useState(false);
    const dispatch = useDispatch();
    const disableSoknadsstatusEndring = useDisableSoknadsstatusEndring(aktivitet);

    const onSubmit = (value: SoknadsstatusValue): Promise<any> =>
        lagreSoknadsstatus(dispatch, value, aktivitet).then(() => {
            setEndring(false);
            document.querySelector<HTMLElement>('.aktivitet-modal')?.focus();
        });

    const visning = <SoknadsstatusEtikett etikett={aktivitet.stillingFraNavData?.soknadsstatus} />;
    const form = <SoknadsstatusForm disabled={disableSoknadsstatusEndring} aktivitet={aktivitet} onSubmit={onSubmit} />;

    return (
        <EndreLinje
            tittel="Hvor er du i søknadsprosessen?"
            form={form}
            endring={endring}
            setEndring={setEndring}
            visning={visning}
        />
    );
};

export default OppdaterSoknadsstatus;
