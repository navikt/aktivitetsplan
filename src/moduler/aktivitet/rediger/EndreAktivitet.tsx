import React, { FunctionComponent, MouseEventHandler, MutableRefObject, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AnyAction } from 'redux';

import { STATUS } from '../../../api/utils';
import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
} from '../../../constant';
import { AlleAktiviteter, isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
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
import { CONFIRM, useConfirmOnBeforeUnload } from '../../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import { useReduxDispatch } from '../../../felles-komponenter/hooks/useReduxDispatch';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import Innholdslaster, { Avhengighet } from '../../../felles-komponenter/utils/Innholdslaster';
import { useRoutes } from '../../../routes';
import { removeEmptyKeysFromObject } from '../../../utils/object';
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
import { selectAktivitetFeilmeldinger, selectAktivitetStatus } from '../aktivitet-selector';
import { selectAktivitetMedId } from '../aktivitetlisteSelector';

export type AktivitetFormValues =
    | StillingAktivitetFormValues
    | EgenAktivitetFormValues
    | SokeavtaleAktivitetFormValues
    | MedisinskBehandlingFormValues
    | MoteAktivitetFormValues
    | { status: string; avtalt: boolean }
    | IJobbAktivitetFormValues;

interface SubComponentProps<Aktivitet extends VeilarbAktivitet> {
    onSubmit: (values: AktivitetFormValues) => Promise<void>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet: Aktivitet;
}

type EndreForm<Aktivitet extends VeilarbAktivitet> = FunctionComponent<SubComponentProps<Aktivitet>>;

interface FormProps<T extends AlleAktiviteter> {
    aktivitet: T;
    onSubmit: (aktivitet: Record<any, any>) => Promise<void>;
    endre: boolean;
    dirtyRef: MutableRefObject<boolean>;
    lagrer: boolean;
}

function getAktivitetsFormComponent<T extends VeilarbAktivitet>(
    aktivitet: VeilarbAktivitet | null,
    formProps: FormProps<T>
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
    const dispatch = useReduxDispatch();
    const doOppdaterAktivitet = (aktivitet: AlleAktiviteter) =>
        dispatch(oppdaterAktivitet(aktivitet) as unknown as AnyAction);

    const isDirty = useRef(false);
    useConfirmOnBeforeUnload(isDirty);
    const navigate = useNavigate();

    const { id: aktivitetId } = useParams<{ id: string }>();
    const valgtAktivitet = useSelector((state) => (aktivitetId ? selectAktivitetMedId(state, aktivitetId) : undefined));
    const avhengigheter: Avhengighet[] = [valgtAktivitet ? STATUS.OK : STATUS.PENDING];
    const aktivitetFeilmeldinger = useSelector((state) => selectAktivitetFeilmeldinger(state));
    const lagrer = useSelector((state) => selectAktivitetStatus(state)) !== STATUS.OK;

    const { aktivitetRoute, hovedsideRoute } = useRoutes();

    function oppdater(aktivitet: AlleAktiviteter) {
        if (!valgtAktivitet) return;
        const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
        const oppdatertAktivitet = { ...valgtAktivitet, ...filteredAktivitet } as AlleAktiviteter;
        return doOppdaterAktivitet(oppdatertAktivitet).then(() => navigate(aktivitetRoute(valgtAktivitet.id)));
    }

    const onReqClose = () => {
        if (!isDirty.current || window.confirm(CONFIRM)) {
            navigate(hovedsideRoute());
        }
    };

    const onReqBack: MouseEventHandler = (e) => {
        e.preventDefault();
        if (!isDirty.current || window.confirm(CONFIRM)) {
            navigate(-1);
        }
    };

    const header = <ModalHeader tilbakeTekst="Tilbake" onTilbakeClick={onReqBack} />;

    const formProps = {
        aktivitet: valgtAktivitet,
        onSubmit: oppdater,
        endre: true,
        dirtyRef: isDirty,
        lagrer,
    };

    const aktivitetForm =
        valgtAktivitet && isVeilarbAktivitet(valgtAktivitet)
            ? getAktivitetsFormComponent(valgtAktivitet, formProps)
            : null;
    return (
        <Modal
            header={header}
            feilmeldinger={aktivitetFeilmeldinger}
            onRequestClose={onReqClose}
            contentLabel="Endre aktivitet"
        >
            <article>
                <Innholdslaster avhengigheter={avhengigheter}>
                    <ModalContainer>{aktivitetForm}</ModalContainer>
                </Innholdslaster>
            </article>
        </Modal>
    );
}

export default EndreAktivitet;
