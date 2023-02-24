import PT from 'prop-types';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    STATUS_PLANLAGT,
    STILLING_AKTIVITET_TYPE,
} from '../../../constant';
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
    const { onLagreNyAktivitet, history, match, aktivitetFeilmeldinger, underOppfolging } = props;

    const isDirty = useRef(false);
    useConfirmOnBeforeUnload(isDirty);

    const onSubmitFactory = (aktivitetsType) => {
        return (aktivitet) => {
            const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
            const nyAktivitet = {
                status: STATUS_PLANLAGT,
                type: aktivitetsType,
                ...filteredAktivitet,
            };
            return onLagreNyAktivitet(nyAktivitet).then((action) => history.push(aktivitetRoute(action.data.id)));
        };
    };

    function onRequestClose() {
        const isItReallyDirty = isDirty.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            history.push('/');
        }
    }

    const onReqBack = (e) => {
        e.preventDefault();
        const isItReallyDirty = isDirty.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            history.push('/aktivitet/ny');
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
                <Switch>
                    <Route path={`${match.path}/mote`}>
                        <MoteAktivitetForm onSubmit={onSubmitFactory(MOTE_TYPE)} isDirtyRef={isDirty} />
                    </Route>
                    <Route path={`${match.path}/samtalereferat`}>
                        <SamtalereferatForm onSubmit={onSubmitFactory(SAMTALEREFERAT_TYPE)} isDirtyRef={isDirty} />
                    </Route>
                    <Route path={`${match.path}/stilling`}>
                        <StillingAktivitetForm
                            onSubmit={onSubmitFactory(STILLING_AKTIVITET_TYPE)}
                            isDirtyRef={isDirty}
                        />
                    </Route>
                    <Route path={`${match.path}/sokeavtale`}>
                        <SokeAvtaleAktivitetForm
                            onSubmit={onSubmitFactory(SOKEAVTALE_AKTIVITET_TYPE)}
                            isDirtyRef={isDirty}
                        />
                    </Route>
                    <Route path={`${match.path}/behandling`}>
                        <MedisinskBehandlingForm
                            onSubmit={onSubmitFactory(BEHANDLING_AKTIVITET_TYPE)}
                            isDirtyRef={isDirty}
                        />
                    </Route>
                    <Route path={`${match.path}/egen`}>
                        <EgenAktivitetForm onSubmit={onSubmitFactory(EGEN_AKTIVITET_TYPE)} isDirtyRef={isDirty} />
                    </Route>
                    <Route path={`${match.path}/ijobb`}>
                        <IJobbAktivitetForm onSubmit={onSubmitFactory(IJOBB_AKTIVITET_TYPE)} isDirtyRef={isDirty} />
                    </Route>
                </Switch>
            </article>
        </Modal>
    );
}

NyAktivitetForm.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    history: PT.object.isRequired,
    match: PT.object.isRequired,
    aktivitetFeilmeldinger: PT.array.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    onLagreNyAktivitet: (aktivitet) => dispatch(lagNyAktivitet(aktivitet)),
});

const mapStateToProps = (state) => ({
    aktivitetFeilmeldinger: selectAktivitetFeilmeldinger(state),
    underOppfolging: selectErUnderOppfolging(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(NyAktivitetForm);
