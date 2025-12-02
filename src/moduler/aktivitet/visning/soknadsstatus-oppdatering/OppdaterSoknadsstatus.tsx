import { PersonRectangleIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import { AktivitetStatus, StillingFraNavSoknadsstatus } from '../../../../datatypes/aktivitetTypes';
import { StillingFraNavAktivitet } from '../../../../datatypes/internAktivitetTypes';
import useAppDispatch, { AppDispatch } from '../../../../felles-komponenter/hooks/useAppDispatch';
import { DirtyContext } from '../../../context/dirty-context';
import { oppdaterStillingFraNavSoknadsstatus } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import StillingFraNavEtikett from '../../etikett/StillingFraNavEtikett';
import EndreLinje from '../endre-linje/EndreLinje';
import SoknadsstatusForm, { SoknadsstatusFormValues } from './SoknadsstatusForm';
import { ReadWriteMode, selectReadWriteMode } from '../../../../utils/readOrWriteModeSlice';

const useDisableSoknadsstatusEndring = (aktivitet: StillingFraNavAktivitet) => {
    const { historisk } = aktivitet;
    const lasterAktivitet = useSelector(selectLasterAktivitetData);
    const readOnly = useSelector(selectReadWriteMode) == ReadWriteMode.READ;
    const kanEndreAktivitet =
        !historisk && aktivitet.status !== AktivitetStatus.FULLFOERT && aktivitet.status !== AktivitetStatus.AVBRUTT;

    return lasterAktivitet || readOnly || !kanEndreAktivitet;
};

const lagreSoknadsstatus = (
    dispatch: AppDispatch,
    value: SoknadsstatusValue,
    aktivitet: StillingFraNavAktivitet,
): Promise<any> => {
    const { soknadsstatus } = value;

    if (soknadsstatus === aktivitet.stillingFraNavData?.soknadsstatus) {
        return Promise.resolve();
    }

    return dispatch(
        oppdaterStillingFraNavSoknadsstatus({
            aktivitetId: aktivitet.id,
            aktivitetVersjon: aktivitet.versjon,
            soknadsstatus: soknadsstatus,
        }),
    );
};

interface Props {
    aktivitet: StillingFraNavAktivitet;
}

interface SoknadsstatusValue {
    soknadsstatus: StillingFraNavSoknadsstatus;
}

const getDetaljer = ({ stillingFraNavData }: StillingFraNavAktivitet) => {
    const { soknadsstatus, detaljer } = stillingFraNavData;

    if (!soknadsstatus) return null;

    if (
        soknadsstatus === StillingFraNavSoknadsstatus.IKKE_FATT_JOBBEN &&
        detaljer === 'KANDIDATLISTE_LUKKET_NOEN_ANDRE_FIKK_JOBBEN'
    ) {
        return 'Vi har fått beskjed om at arbeidsgiver har ansatt en person. Dessverre var det ikke deg denne gangen. Ansettelsesprosessen er ferdig.';
    } else if (
        soknadsstatus === StillingFraNavSoknadsstatus.IKKE_FATT_JOBBEN &&
        detaljer === 'KANDIDATLISTE_LUKKET_INGEN_FIKK_JOBBEN'
    ) {
        return 'Vi har fått beskjed om at arbeidsgiveren ikke skal ansatte en person allikevel. Vi beklager at det ikke ble en jobbmulighet denne gangen. Lykke til videre med jobbsøkingen.';
    } else if (soknadsstatus === StillingFraNavSoknadsstatus.FATT_JOBBEN) {
        return 'Ansettelsesprosessen er ferdig.';
    }

    return null;
};

const OppdaterSoknadsstatus = (props: Props) => {
    const { aktivitet } = props;
    const dispatch = useAppDispatch();
    const [open, setIsOpen] = useState(false);
    const disableSoknadsstatusEndring = useDisableSoknadsstatusEndring(aktivitet);

    const detaljer = getDetaljer(aktivitet);
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
            {detaljer ? (
                <Alert variant="info" className="mt-4">
                    {detaljer}
                </Alert>
            ) : null}
            <SoknadsstatusForm
                disabled={disableSoknadsstatusEndring}
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
