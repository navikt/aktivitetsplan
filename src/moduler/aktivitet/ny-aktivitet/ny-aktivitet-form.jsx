import PT from 'prop-types';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
} from '../../../constant';
import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import ErrorBoundry from '../../../felles-komponenter/ErrorBoundry';
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

function NyAktivitetForm(props) {
    const navigate = useNavigate();
    const { onLagreNyAktivitet, aktivitetFeilmeldinger, underOppfolging } = props;

    const dirtyRef = useRef(false);
    useConfirmOnBeforeUnload(dirtyRef);

    const onSubmitFactory = (aktivitetsType) => {
        return (aktivitet) => {
            const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
            const nyAktivitet = {
                status: AktivitetStatus.PLANLAGT,
                type: aktivitetsType,
                ...filteredAktivitet,
            };
            return onLagreNyAktivitet(nyAktivitet).then((action) => navigate(aktivitetRoute(action.data.id)));
        };
    };

    function onRequestClose() {
        const isItReallyDirty = dirtyRef.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            navigate('/');
        }
    }

    const onReqBack = (e) => {
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
                            element={<MoteAktivitetForm onSubmit={onSubmitFactory(MOTE_TYPE)} dirtyRef={dirtyRef} />}
                        />
                        <Route
                            path={`samtalereferat`}
                            element={
                                <SamtalereferatForm
                                    onSubmit={onSubmitFactory(SAMTALEREFERAT_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                        <Route
                            path={`stilling`}
                            element={
                                <StillingAktivitetForm
                                    onSubmit={onSubmitFactory(STILLING_AKTIVITET_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                        <Route
                            path={`sokeavtale`}
                            element={
                                <SokeAvtaleAktivitetForm
                                    onSubmit={onSubmitFactory(SOKEAVTALE_AKTIVITET_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                        <Route
                            path={`behandling`}
                            element={
                                <MedisinskBehandlingForm
                                    onSubmit={onSubmitFactory(BEHANDLING_AKTIVITET_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                        <Route
                            path={`egen`}
                            element={
                                <EgenAktivitetForm
                                    onSubmit={onSubmitFactory(EGEN_AKTIVITET_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                        <Route
                            path={`ijobb`}
                            element={
                                <IJobbAktivitetForm
                                    onSubmit={onSubmitFactory(IJOBB_AKTIVITET_TYPE)}
                                    dirtyRef={dirtyRef}
                                />
                            }
                        />
                    </Routes>
                </article>
            </ErrorBoundry>
        </Modal>
    );
}

NyAktivitetForm.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    aktivitetFeilmeldinger: PT.array.isRequired,
    underOppfolging: PT.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    onLagreNyAktivitet: (aktivitet) => dispatch(lagNyAktivitet(aktivitet)),
});

const mapStateToProps = (state) => ({
    aktivitetFeilmeldinger: selectAktivitetFeilmeldinger(state),
    underOppfolging: selectErUnderOppfolging(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(NyAktivitetForm);
