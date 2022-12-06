import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { AnyAction } from 'redux';

import { STATUS_PLANLAGT } from '../../../constant';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { CONFIRM, useConfirmOnBeforeUnload } from '../../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import { aktivitetRoute } from '../../../routes';
import { removeEmptyKeysFromObject } from '../../../utils/object';
import { selectErUnderOppfolging } from '../../oppfolging-status/oppfolging-selector';
import { lagNyAktivitet } from '../aktivitet-actions';
import MedisinskBehandlingForm from '../aktivitet-forms/behandling/MedisinskBehandlingForm';
import EgenAktivitetForm from '../aktivitet-forms/egen/AktivitetEgenForm';
import IJobbAktivitetForm from '../aktivitet-forms/ijobb/AktivitetIjobbForm';
import MoteAktivitetForm from '../aktivitet-forms/mote/MoteAktivitetForm';
import SamtalereferatForm from '../aktivitet-forms/samtalereferat/SamtalereferatForm';
import SokeAvtaleAktivitetForm from '../aktivitet-forms/sokeavtale/AktivitetSokeavtaleForm';
import StillingAktivitetForm from '../aktivitet-forms/stilling/AktivitetStillingForm';
import { selectAktivitetFeilmeldinger } from '../aktivitet-selector';

function NyAktivitetForm() {
    const navigate = useNavigate();
    const aktivitetFeilmeldinger = useSelector(selectAktivitetFeilmeldinger);
    const underOppfolging = useSelector(selectErUnderOppfolging);

    const isDirty = useRef(false);
    useConfirmOnBeforeUnload(isDirty);

    const dispatch = useDispatch();

    const onSubmitFactory = (aktivitetType: VeilarbAktivitetType) => {
        return (aktivitet: any) => {
            const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
            const nyAktivitet = {
                status: STATUS_PLANLAGT,
                type: aktivitetType,
                ...filteredAktivitet,
            } as VeilarbAktivitet;
            return dispatch(lagNyAktivitet(nyAktivitet) as unknown as AnyAction).then((action: AnyAction) =>
                navigate(aktivitetRoute(action.data.id))
            );
        };
    };

    function onRequestClose() {
        const isItReallyDirty = isDirty.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            navigate('/');
        }
    }

    const onReqBack = (e: React.MouseEvent) => {
        e.preventDefault();
        const isItReallyDirty = isDirty.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            navigate('/aktivitet/ny');
        }
    };

    const header = <ModalHeader tilbakeTekst="Tilbake til kategorier" onTilbakeClick={onReqBack} />;

    if (!underOppfolging) {
        return null;
    }

    return (
        <Modal
            header={header}
            onRequestClose={onRequestClose}
            contentLabel="ny-aktivitet-modal"
            feilmeldinger={aktivitetFeilmeldinger}
        >
            <article>
                <ModalContainer>
                    <Routes>
                        <Route
                            path="/mote"
                            element={
                                <MoteAktivitetForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.MOTE_TYPE)}
                                    isDirtyRef={isDirty}
                                />
                            }
                        />
                        <Route
                            path="/samtalereferat"
                            element={
                                <SamtalereferatForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.SAMTALEREFERAT_TYPE)}
                                    isDirtyRef={isDirty}
                                />
                            }
                        />
                        <Route
                            path="/stilling"
                            element={
                                <StillingAktivitetForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.STILLING_AKTIVITET_TYPE)}
                                    isDirtyRef={isDirty}
                                />
                            }
                        />
                        <Route
                            path="/sokeavtale"
                            element={
                                <SokeAvtaleAktivitetForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE)}
                                    isDirtyRef={isDirty}
                                />
                            }
                        />
                        <Route
                            path="/behandling"
                            element={
                                <MedisinskBehandlingForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE)}
                                    isDirtyRef={isDirty}
                                />
                            }
                        />
                        <Route
                            path="/egen"
                            element={
                                <EgenAktivitetForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.EGEN_AKTIVITET_TYPE)}
                                    isDirtyRef={isDirty}
                                />
                            }
                        />
                        <Route
                            path="/ijobb"
                            element={
                                <IJobbAktivitetForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.IJOBB_AKTIVITET_TYPE)}
                                    isDirtyRef={isDirty}
                                />
                            }
                        />
                    </Routes>
                </ModalContainer>
            </article>
        </Modal>
    );
}

export default NyAktivitetForm;
