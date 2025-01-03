import  { isFulfilled } from '@reduxjs/toolkit';
import React, { MutableRefObject, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
} from '../../../constant';
import { Status } from '../../../createGenericSlice';
import { isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
import {
    EgenAktivitet,
    IJobbAktivitet,
    MedisinskBehandlingAktivitet,
    MoteAktivitet,
    SamtalereferatAktivitet,
    SokeavtaleAktivitet,
    StillingAktivitet,
    VeilarbAktivitet,
} from '../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import { CONFIRM, useConfirmOnBeforeUnload } from '../../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import Innholdslaster, { Avhengighet } from '../../../felles-komponenter/utils/Innholdslaster';
import { useRoutes } from '../../../routing/useRoutes';
import { RootState } from '../../../store';
import { removeEmptyKeysFromObject } from '../../../utils/object';
import Feilmelding from '../../feilmelding/Feilmelding';
import { oppdaterAktivitet } from '../aktivitet-actions';
import MedisinskBehandlingForm, {
    MedisinskBehandlingFormValues,
} from '../aktivitet-forms/behandling/MedisinskBehandlingForm';
import EgenAktivitetForm, { EgenAktivitetFormValues } from '../aktivitet-forms/egen/AktivitetEgenForm';
import IJobbAktivitetForm, { IJobbAktivitetFormValues } from '../aktivitet-forms/ijobb/AktivitetIjobbForm';
import MoteAktivitetForm, { MoteAktivitetFormValues } from '../aktivitet-forms/mote/MoteAktivitetForm';
import SamtalereferatForm from '../aktivitet-forms/samtalereferat/SamtalereferatForm';
import SokeavtaleAktivitetForm, {
    SokeavtaleAktivitetFormValues,
} from '../aktivitet-forms/sokeavtale/AktivitetSokeavtaleForm';
import StillingAktivitetForm, { StillingAktivitetFormValues } from '../aktivitet-forms/stilling/AktivitetStillingForm';
import {
    selectAktivitetFeilmeldinger,
    selectAktivitetStatus,
    selecteEndreAktivitetFeilmeldinger,
} from '../aktivitet-selector';
import { selectAktivitetMedId } from '../aktivitetlisteSelector';
import { logModalLukket } from '../../../amplitude/amplitude';

export type AktivitetFormValues =
    | StillingAktivitetFormValues
    | EgenAktivitetFormValues
    | SokeavtaleAktivitetFormValues
    | MedisinskBehandlingFormValues
    | MoteAktivitetFormValues
    | { status: string; avtalt: boolean }
    | IJobbAktivitetFormValues;

interface FormProps<T extends VeilarbAktivitet> {
    aktivitet: T;
    onSubmit: (aktivitet: AktivitetFormValues) => Promise<void>;
    endre: boolean;
    dirtyRef: MutableRefObject<boolean>;
    lagrer: boolean;
}

function getAktivitetsFormComponent<T extends VeilarbAktivitet>(
    aktivitet: VeilarbAktivitet | null,
    formProps: FormProps<T>,
) {
    if (!aktivitet) {
        return null;
    }
    switch (aktivitet.type) {
        case STILLING_AKTIVITET_TYPE:
            return <StillingAktivitetForm {...(formProps as FormProps<StillingAktivitet>)} />;
        case EGEN_AKTIVITET_TYPE:
            return <EgenAktivitetForm {...(formProps as FormProps<EgenAktivitet>)} />;
        case SOKEAVTALE_AKTIVITET_TYPE:
            return <SokeavtaleAktivitetForm {...(formProps as FormProps<SokeavtaleAktivitet>)} />;
        case BEHANDLING_AKTIVITET_TYPE:
            return <MedisinskBehandlingForm {...(formProps as FormProps<MedisinskBehandlingAktivitet>)} />;
        case MOTE_TYPE:
            return <MoteAktivitetForm {...(formProps as FormProps<MoteAktivitet>)} />;
        case SAMTALEREFERAT_TYPE:
            return <SamtalereferatForm {...(formProps as FormProps<SamtalereferatAktivitet>)} />;
        case IJOBB_AKTIVITET_TYPE:
            return <IJobbAktivitetForm {...(formProps as FormProps<IJobbAktivitet>)} />;
        default:
            return null;
    }
}

function EndreAktivitet() {
    const dispatch = useAppDispatch();
    const doOppdaterAktivitet = (aktivitet: VeilarbAktivitet) => dispatch(oppdaterAktivitet(aktivitet));

    const isDirty = useRef(false);
    useConfirmOnBeforeUnload(isDirty);
    const navigate = useNavigate();

    const { id: aktivitetId } = useParams<{ id: string }>();
    const valgtAktivitet = useSelector((state: RootState) =>
        aktivitetId ? selectAktivitetMedId(state, aktivitetId) : undefined,
    );
    const avhengigheter: Avhengighet[] = [valgtAktivitet ? Status.OK : Status.PENDING];
    const aktivitetFeilmelding = useSelector(selectAktivitetFeilmeldinger);
    const oppdaterFeilmelding = useSelector(selecteEndreAktivitetFeilmeldinger);

    const alleFeil = [...oppdaterFeilmelding, ...aktivitetFeilmelding];

    const lagrer = useSelector((state: RootState) => selectAktivitetStatus(state)) !== Status.OK;

    const { aktivitetRoute, hovedsideRoute } = useRoutes();

    function oppdater(aktivitet: AktivitetFormValues): Promise<void> {
        if (!valgtAktivitet) return Promise.resolve();
        const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
        const oppdatertAktivitet = { ...valgtAktivitet, ...filteredAktivitet } as VeilarbAktivitet;
        return doOppdaterAktivitet(oppdatertAktivitet).then((action) => {
            if (isFulfilled(action)) {
                navigate(aktivitetRoute(valgtAktivitet.id));
            }
        });
    }

    const onReqClose = () => {
        if (!isDirty.current || window.confirm(CONFIRM)) {
            const aktivitet = valgtAktivitet?.type;
            if (aktivitet) {
                logModalLukket({
                    isDirty: isDirty.current,
                    aktivitet: aktivitet,
                    modalType: 'endre-aktivitet',
                    navType: 'onReqClose',
                });
            }
            return true;
        }
        return false;
    };

    const formProps = {
        onSubmit: oppdater,
        endre: true,
        dirtyRef: isDirty,
        lagrer,
    };

    const aktivitetForm =
        valgtAktivitet && isVeilarbAktivitet(valgtAktivitet)
            ? getAktivitetsFormComponent(valgtAktivitet, { ...formProps, aktivitet: valgtAktivitet })
            : null;

    const tilHovedside = () => navigate(hovedsideRoute());

    return (
        <Modal
            lukkPåKlikkUtenfor={false}
            onClose={tilHovedside}
            heading="Endre aktivitet"
            onRequestClose={onReqClose}
        >
            <article>
                <Innholdslaster avhengigheter={avhengigheter}>
                    <ModalContainer>{aktivitetForm}</ModalContainer>
                </Innholdslaster>
            </article>
            <Feilmelding feilmeldinger={alleFeil} />
        </Modal>
    );
}

export default EndreAktivitet;
