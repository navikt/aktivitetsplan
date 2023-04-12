import { PayloadAction } from '@reduxjs/toolkit';
import React, { MouseEventHandler, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import ErrorBoundry from '../../../felles-komponenter/ErrorBoundry';
import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import { CONFIRM, useConfirmOnBeforeUnload } from '../../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import Modal from '../../../felles-komponenter/modal/Modal';
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
import { AktivitetFormValues } from '../rediger/EndreAktivitet';

const NyAktivitetForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const aktivitetFeilmeldinger = useSelector(selectAktivitetFeilmeldinger);
    const underOppfolging = useSelector(selectErUnderOppfolging);

    const dirtyRef = useRef(false);
    useConfirmOnBeforeUnload(dirtyRef);

    const onSubmitFactory = (aktivitetsType: VeilarbAktivitetType) => {
        return (aktivitet: AktivitetFormValues) => {
            const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
            const nyAktivitet: VeilarbAktivitet = {
                status: AktivitetStatus.PLANLAGT,
                type: aktivitetsType,
                ...filteredAktivitet,
            } as VeilarbAktivitet;
            return dispatch(lagNyAktivitet(nyAktivitet)).then((action) =>
                navigate(aktivitetRoute((action as PayloadAction<VeilarbAktivitet>).payload.id))
            );
        };
    };

    function onRequestClose() {
        const isItReallyDirty = dirtyRef.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            navigate('/');
        }
    }

    const onReqBack: MouseEventHandler = (e) => {
        e.preventDefault();
        const isItReallyDirty = dirtyRef.current;
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
            <ErrorBoundry>
                <article>
                    <Routes>
                        <Route
                            path={`mote`}
                            element={
                                <MoteAktivitetForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.MOTE_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                        <Route
                            path={`samtalereferat`}
                            element={
                                <SamtalereferatForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.SAMTALEREFERAT_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                        <Route
                            path={`stilling`}
                            element={
                                <StillingAktivitetForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.STILLING_AKTIVITET_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                        <Route
                            path={`sokeavtale`}
                            element={
                                <SokeAvtaleAktivitetForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                        <Route
                            path={`behandling`}
                            element={
                                <MedisinskBehandlingForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                        <Route
                            path={`egen`}
                            element={
                                <EgenAktivitetForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.EGEN_AKTIVITET_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                        <Route
                            path={`ijobb`}
                            element={
                                <IJobbAktivitetForm
                                    onSubmit={onSubmitFactory(VeilarbAktivitetType.IJOBB_AKTIVITET_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                    </Routes>
                </article>
            </ErrorBoundry>
        </Modal>
    );
};

export default NyAktivitetForm;
