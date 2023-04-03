import { PersonRectangleIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import { StillingFraNavSoknadsstatus } from '../../../../datatypes/aktivitetTypes';
import { StillingFraNavAktivitet } from '../../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';
import { fikkikkejobbendetaljermapping } from '../../../../tekster/fikkIkkeJobbenDetaljer';
import { DirtyContext } from '../../../context/dirty-context';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { oppdaterStillingFraNavSoknadsstatus } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import StillingFraNavEtikett from '../../etikett/StillingFraNavEtikett';
import EndreLinje from '../endre-linje/EndreLinje';
import SoknadsstatusForm, { SoknadsstatusFormValues } from './SoknadsstatusForm';

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
    const dispatch = useAppDispatch();
    const [open, setIsOpen] = useState(false);
    const disableSoknadsstatusEndring = useDisableSoknadsstatusEndring(aktivitet);

    const endretAvBruker = aktivitet.endretAvType === 'BRUKER';
    const ikkeAvslag = StillingFraNavSoknadsstatus.IKKE_FATT_JOBBEN !== aktivitet.stillingFraNavData?.soknadsstatus;
    const kanEndre = ikkeAvslag || endretAvBruker;
    const skalViseInfoBoks = !kanEndre;

    const ikkefattjobbendetaljer = fikkikkejobbendetaljermapping.get(
        aktivitet.stillingFraNavData?.ikkefattjobbendetaljer
    );
    const { setFormIsDirty } = useContext(DirtyContext);

    const onSubmitHandler = (value: SoknadsstatusFormValues): Promise<any> => {
        setFormIsDirty('soknadsstatus', false);
        return lagreSoknadsstatus(dispatch, value, aktivitet).then(() => {
            setIsOpen(false);
            document.querySelector<HTMLElement>('.aktivitet-modal')?.focus();
        });
    };

    const content = (
        <>
            {skalViseInfoBoks ? (
                <Alert variant="info" className="mt-4">
                    {ikkefattjobbendetaljer}
                </Alert>
            ) : null}
            <SoknadsstatusForm
                disabled={disableSoknadsstatusEndring || !kanEndre}
                soknadsstatus={aktivitet.stillingFraNavData.soknadsstatus as any}
                onSubmit={onSubmitHandler}
            />
        </>
    );

    return (
        <EndreLinje
            icon={<PersonRectangleIcon fontSize="1.5rem" />}
            onClick={() => {
                if (open) {
                    setFormIsDirty('soknadsstatus', false);
                }
                setIsOpen(!open);
            }}
            open={open}
            tittel="Hvor er du i søknadsprosessen?"
            subtittel={<StillingFraNavEtikett soknadsstatus={aktivitet.stillingFraNavData?.soknadsstatus} />}
            content={content}
        />
    );
};

export default OppdaterSoknadsstatus;
