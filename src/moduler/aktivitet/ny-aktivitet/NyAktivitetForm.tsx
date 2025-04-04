import { PayloadAction, isFulfilled } from '@reduxjs/toolkit';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useMatch, useNavigate } from 'react-router-dom';

import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import { CONFIRM, useConfirmOnBeforeUnload } from '../../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import Modal from '../../../felles-komponenter/modal/Modal';
import { useRoutes } from '../../../routing/useRoutes';
import { removeEmptyKeysFromObject } from '../../../utils/object';
import { selectLagNyAktivitetFeil } from '../../feilmelding/feil-selector';
import Feilmelding from '../../feilmelding/Feilmelding';
import { selectErUnderOppfolging, selectAktivOppfolgingsperiode } from '../../oppfolging-status/oppfolging-selector';
import { lagNyAktivitet } from '../aktivitet-actions';
import MedisinskBehandlingForm from '../aktivitet-forms/behandling/MedisinskBehandlingForm';
import EgenAktivitetForm from '../aktivitet-forms/egen/AktivitetEgenForm';
import IJobbAktivitetForm from '../aktivitet-forms/ijobb/AktivitetIjobbForm';
import MoteAktivitetForm from '../aktivitet-forms/mote/MoteAktivitetForm';
import SamtalereferatForm from '../aktivitet-forms/samtalereferat/SamtalereferatForm';
import SokeAvtaleAktivitetForm from '../aktivitet-forms/sokeavtale/AktivitetSokeavtaleForm';
import StillingAktivitetForm from '../aktivitet-forms/stilling/AktivitetStillingForm';
import { AktivitetFormValues } from '../rediger/EndreAktivitet';
import { logModalLukket } from '../../../amplitude/amplitude';
import { useErVeileder } from '../../../Provider';

const aktivitetHeadings = {
    mote: 'Møte med Nav',
    samtalereferat: 'Samtalereferat',
    stilling: 'En jobb jeg vil søke på',
    sokeavtale: 'Avtale om å søke jobber',
    behandling: 'Medisinsk behandling',
    egen: 'Jobbrettet egenaktivitet',
    ijobb: 'Jobb jeg har nå',
};
type AktivitetRoutes = keyof typeof aktivitetHeadings;
interface RouteMatch {
    params: {
        aktivitetType: AktivitetRoutes;
    };
}

const NyAktivitetForm = () => {
    const navigate = useNavigate();
    const erVeileder = useErVeileder();
    const match = useMatch(`${erVeileder ? '/aktivitetsplan' : ''}/aktivitet/ny/:aktivitetType`) as RouteMatch;
    const dispatch = useAppDispatch();
    const { aktivitetRoute, hovedsideRoute } = useRoutes();
    const tilHovedside = () => navigate(hovedsideRoute());

    const opprettFeil = useSelector(selectLagNyAktivitetFeil);
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const currentOpenOppfolgingsPeriode = useSelector(selectAktivOppfolgingsperiode);

    const dirtyRef = useRef(false);
    useConfirmOnBeforeUnload(dirtyRef);

    function onRequestClose() {
        const isItReallyDirty = dirtyRef.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            // Assign to const before navigating to avoid race-condition
            const aktivitet = match.params.aktivitetType;
            navigate(hovedsideRoute());
            logModalLukket({ isDirty: isItReallyDirty, aktivitet, modalType: 'ny-aktivitet', navType: 'onReqClose' });
            return true;
        }
        return false;
    }

    if (!underOppfolging || !currentOpenOppfolgingsPeriode) {
        return null;
    }

    const onSubmitFactory = (aktivitetsType: VeilarbAktivitetType) => {
        return (aktivitet: AktivitetFormValues) => {
            const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
            const nyAktivitet: VeilarbAktivitet = {
                status: AktivitetStatus.PLANLAGT,
                type: aktivitetsType,
                ...filteredAktivitet,
            } as VeilarbAktivitet;
            return dispatch(
                lagNyAktivitet({ aktivitet: nyAktivitet, oppfolgingsPeriodeId: currentOpenOppfolgingsPeriode.id }),
            ).then((action) => {
                if (isFulfilled(action)) {
                    navigate(aktivitetRoute((action as PayloadAction<VeilarbAktivitet>).payload.id));
                }
            });
        };
    };

    return (
        <Modal
            heading={match?.params?.aktivitetType ? aktivitetHeadings[match.params.aktivitetType] : ''}
            onRequestClose={onRequestClose}
            onClose={tilHovedside}
            lukkPåKlikkUtenfor={false}
        >
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
            <Feilmelding feilmeldinger={opprettFeil} />
        </Modal>
    );
};

export default NyAktivitetForm;
