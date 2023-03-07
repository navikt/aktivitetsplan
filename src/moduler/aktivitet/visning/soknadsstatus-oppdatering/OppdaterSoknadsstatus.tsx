import { Alert } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import { IKKE_FATT_JOBBEN } from '../../../../constant';
import { StillingFraNavSoknadsstatus } from '../../../../datatypes/aktivitetTypes';
import { StillingFraNavAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { fikkikkejobbendetaljermapping } from '../../../../tekster/fikkIkkeJobbenDetaljer';
import { DirtyContext } from '../../../context/dirty-context';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { oppdaterStillingFraNavSoknadsstatus } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import StillingFraNavEtikett from '../../etikett/StillingFraNavEtikett';
import EndreLinje from '../endre-linje/EndreLinje';
import SoknadsstatusForm from './SoknadsstatusForm';

const useDisableSoknadsstatusEndring = (aktivitet: StillingFraNavAktivitet) => {
    const { historisk } = aktivitet;
    const lasterAktivitet = useSelector(selectLasterAktivitetData);
    const erUnderOppfolging = useSelector(selectErUnderOppfolging);
    const kanEndreAktivitet = !historisk;

    return lasterAktivitet || !erUnderOppfolging || !kanEndreAktivitet;
};

const lagreSoknadsstatus = (
    dispatch: Dispatch,
    value: SoknadsstatusValue,
    aktivitet: StillingFraNavAktivitet
): Promise<any> => {
    const { soknadsstatus } = value;

    if (soknadsstatus === aktivitet.stillingFraNavData?.soknadsstatus) {
        return Promise.resolve();
    }

    return oppdaterStillingFraNavSoknadsstatus(aktivitet.id, aktivitet.versjon, soknadsstatus)(dispatch);
};

interface Props {
    aktivitet: StillingFraNavAktivitet;
}

interface SoknadsstatusValue {
    soknadsstatus: StillingFraNavSoknadsstatus;
}

const OppdaterSoknadsstatus = (props: Props) => {
    const { aktivitet } = props;
    const [open, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const disableSoknadsstatusEndring = useDisableSoknadsstatusEndring(aktivitet);

    const onSubmit = (value: SoknadsstatusValue): Promise<any> => {
        setFormIsDirty('soknadsstatus', false);
        return lagreSoknadsstatus(dispatch, value, aktivitet).then(() => {
            setIsOpen(false);
            document.querySelector<HTMLElement>('.aktivitet-modal')?.focus();
        });
    };

    const endretAvBruker = aktivitet.endretAvType === 'BRUKER';
    const ikkeAvslag = IKKE_FATT_JOBBEN !== aktivitet.stillingFraNavData?.soknadsstatus;
    const kanEndre = ikkeAvslag || endretAvBruker;
    const skalViseInfoBoks = !kanEndre;

    const ikkefattjobbendetaljer = fikkikkejobbendetaljermapping.get(
        aktivitet.stillingFraNavData?.ikkefattjobbendetaljer
    );
    const visning = <StillingFraNavEtikett soknadsstatus={aktivitet.stillingFraNavData?.soknadsstatus} />;
    const { setFormIsDirty } = useContext(DirtyContext);
    const form = (
        <>
            {skalViseInfoBoks ? (
                <Alert variant="info" className="mt-4">
                    {ikkefattjobbendetaljer}
                </Alert>
            ) : null}
            <SoknadsstatusForm disabled={disableSoknadsstatusEndring} aktivitet={aktivitet} onSubmit={onSubmit} />
        </>
    );

    return (
        <EndreLinje
            onClick={() => {
                if (open) {
                    setFormIsDirty('soknadsstatus', false);
                }
                setIsOpen(!open);
            }}
            open={open}
            tittel="Hvor er du i søknadsprosessen?"
            form={form}
            kanEndre={kanEndre}
            subtittel={visning}
        />
    );
};

export default OppdaterSoknadsstatus;
