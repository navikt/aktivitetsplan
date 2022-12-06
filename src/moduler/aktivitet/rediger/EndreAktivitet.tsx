import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import { CONFIRM, useConfirmOnBeforeUnload } from '../../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import Innholdslaster, { Avhengighet } from '../../../felles-komponenter/utils/Innholdslaster';
import { aktivitetRoute } from '../../../routes';
import { removeEmptyKeysFromObject } from '../../../utils/object';
import { oppdaterAktivitet } from '../aktivitet-actions';
import MedisinskBehandlingForm from '../aktivitet-forms/behandling/MedisinskBehandlingForm';
import EgenAktivitetForm from '../aktivitet-forms/egen/AktivitetEgenForm';
import IJobbAktivitetForm from '../aktivitet-forms/ijobb/AktivitetIjobbForm';
import MoteAktivitetForm from '../aktivitet-forms/mote/MoteAktivitetForm';
import SamtalereferatForm from '../aktivitet-forms/samtalereferat/SamtalereferatForm';
import SokeavtaleAktivitetForm from '../aktivitet-forms/sokeavtale/AktivitetSokeavtaleForm';
import StillingAktivitetForm from '../aktivitet-forms/stilling/AktivitetStillingForm';
import { selectAktivitetFeilmeldinger, selectAktivitetStatus } from '../aktivitet-selector';
import { selectAktivitetMedId } from '../aktivitetlisteSelector';

function getAktivitetsFormComponent(aktivitet?: AlleAktiviteter) {
    if (!aktivitet) {
        return null;
    }
    switch (aktivitet.type) {
        case STILLING_AKTIVITET_TYPE:
            return StillingAktivitetForm;
        case EGEN_AKTIVITET_TYPE:
            return EgenAktivitetForm;
        case SOKEAVTALE_AKTIVITET_TYPE:
            return SokeavtaleAktivitetForm;
        case BEHANDLING_AKTIVITET_TYPE:
            return MedisinskBehandlingForm;
        case MOTE_TYPE:
            return MoteAktivitetForm;
        case SAMTALEREFERAT_TYPE:
            return SamtalereferatForm;
        case IJOBB_AKTIVITET_TYPE:
            return IJobbAktivitetForm;
        default:
            return null;
    }
}

function EndreAktivitet() {
    const { id } = useParams();
    const aktivitetId = id as string;

    const valgtAktivitet = useSelector((state) => selectAktivitetMedId(state, aktivitetId));
    const avhengigheter = [valgtAktivitet ? STATUS.OK : STATUS.PENDING] as Avhengighet[];

    const aktivitetFeilmeldinger = useSelector(selectAktivitetFeilmeldinger);
    const lagrer = useSelector(selectAktivitetStatus) !== STATUS.OK;

    const navigate = useNavigate();

    const isDirty = useRef(false);
    useConfirmOnBeforeUnload(isDirty);

    const dispatch = useDispatch();

    const doOppdaterAktivitet = (aktivitet: VeilarbAktivitet) => {
        return dispatch(oppdaterAktivitet(aktivitet) as unknown as AnyAction);
    };

    function oppdater(aktivitet: VeilarbAktivitet) {
        const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
        const oppdatertAktivitet = { ...valgtAktivitet, ...filteredAktivitet } as VeilarbAktivitet;
        return doOppdaterAktivitet(oppdatertAktivitet).then(() => navigate(aktivitetRoute(valgtAktivitet!!.id)));
    }

    const onReqClose = () => {
        if (!isDirty.current || window.confirm(CONFIRM)) {
            navigate('/');
        }
    };

    const onReqBack = (e: React.MouseEvent) => {
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
        isDirtyRef: isDirty,
        lagrer,
    }; // TODO type det her

    const Form = getAktivitetsFormComponent(valgtAktivitet);
    const AktivitetForm = Form ? <Form {...(formProps as any)} /> : null;

    return (
        <Modal
            header={header}
            feilmeldinger={aktivitetFeilmeldinger}
            onRequestClose={onReqClose}
            contentLabel="aktivitet-modal"
        >
            <article>
                <Innholdslaster avhengigheter={avhengigheter}>
                    <ModalContainer>{AktivitetForm}</ModalContainer>
                </Innholdslaster>
            </article>
        </Modal>
    );
}

export default EndreAktivitet;
