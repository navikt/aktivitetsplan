import React, { useEffect, useRef } from 'react';
import { Route, Switch } from 'react-router-dom';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { isDirty } from 'redux-form';
import { lagNyAktivitet } from '../aktivitet-actions';
import { LUKK_MODAL } from '../../../felles-komponenter/modal/modal-reducer';
import StillingAktivitet from './stilling/ny-aktivitet-stilling';
import SokeavtaleAktivitet from './sokeavtale/ny-aktivitet-sokeavtale';
import BehandlingAktivitet from './behandling/ny-aktivitet-behandling';
import NyMoteAktivitet from './mote/ny-mote-aktivitet';
import NyttSamtalereferat from './samtalereferat/nytt-samtalereferat';
import EgenAktivitet from './egen/ny-aktivitet-egen';
import { aktivitetRoute } from '../../../routing';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import { formNavn } from './aktivitet-form-utils';
import { STATUS } from '../../../ducks/utils';
import {
    selectAktivitetFeilmeldinger,
    selectAktivitetStatus,
} from '../aktivitet-selector';
import { IJOBB_AKTIVITET_TYPE } from '../../../constant';
import IJobbAktivitetForm from './ijobb/aktivitet-ijobb-form';

const CONFIRM =
    'Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?';

function onBeforeLoadEffect(formIsDirty, formIsDirtyV2) {
    window.onbeforeunload = e => {
        if (formIsDirty || formIsDirtyV2.current) {
            e.returnValue = CONFIRM;
            return CONFIRM;
        }
        return undefined;
    };

    return () => {
        window.onbeforeunload = null;
    };
}

function AktivitetFormContainer(props) {
    const {
        onLagreNyAktivitet,
        lagrer,
        formIsDirty,
        history,
        lukkModal,
        match,
        aktivitetFeilmeldinger,
    } = props;

    const formIsDirtyV2 = useRef(false);

    useEffect(onBeforeLoadEffect(formIsDirty, formIsDirtyV2), [
        formIsDirty,
        formIsDirtyV2,
    ]);

    function onLagre(aktivitet) {
        return onLagreNyAktivitet(aktivitet).then(action =>
            history.push(aktivitetRoute(action.data.id))
        );
    }

    const onSubmitFactory = aktivitetsType => {
        return aktivitet => {
            const filteredAktivitet = Object.keys(
                aktivitet
            ).reduce((obj, key) => {
                if (aktivitet[key].length > 0) {
                    obj[key] = aktivitet[key]; // eslint-disable-line
                }
                return obj;
            }, {});

            const nyAktivitet = { ...filteredAktivitet, type: aktivitetsType };
            return onLagreNyAktivitet(nyAktivitet).then(action =>
                history.push(aktivitetRoute(action.data.id))
            );
        };
    };

    function onRequestClose() {
        const isItReallyDirty = formIsDirty || formIsDirtyV2.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            history.push('/');
            lukkModal();
        }
    }

    const formProps = {
        onLagreNyAktivitet: onLagre,
        formIsDirty,
        lagrer,
    };

    const header = (
        <ModalHeader
            visConfirmDialog={formIsDirty}
            tilbakeTekstId="ny-aktivitet-modal.tilbake"
        />
    );

    return (
        <Modal
            header={header}
            onRequestClose={onRequestClose}
            contentLabel="ny-aktivitet-modal"
            feilmeldinger={aktivitetFeilmeldinger}
        >
            <article>
                <ModalContainer>
                    <Switch>
                        <Route path={`${match.path}/mote`}>
                            <NyMoteAktivitet {...formProps} />
                        </Route>
                        <Route path={`${match.path}/samtalereferat`}>
                            <NyttSamtalereferat {...formProps} />
                        </Route>
                        <Route path={`${match.path}/stilling`}>
                            <StillingAktivitet {...formProps} />
                        </Route>
                        <Route path={`${match.path}/sokeavtale`}>
                            <SokeavtaleAktivitet {...formProps} />
                        </Route>
                        <Route path={`${match.path}/behandling`}>
                            <BehandlingAktivitet {...formProps} />
                        </Route>
                        <Route path={`${match.path}/egen`}>
                            <EgenAktivitet {...formProps} />
                        </Route>
                        <Route path={`${match.path}/ijobb`}>
                            <IJobbAktivitetForm
                                onSubmit={onSubmitFactory(IJOBB_AKTIVITET_TYPE)}
                                isDirtyRef={formIsDirtyV2}
                            />
                        </Route>
                    </Switch>
                </ModalContainer>
            </article>
        </Modal>
    );
}

AktivitetFormContainer.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    formIsDirty: PT.bool.isRequired,
    lagrer: PT.bool.isRequired,
    lukkModal: PT.func.isRequired,
    history: PT.object.isRequired,
    match: PT.object.isRequired,
    aktivitetFeilmeldinger: PT.array.isRequired,
};

const mapDispatchToProps = dispatch => ({
    onLagreNyAktivitet: aktivitet => dispatch(lagNyAktivitet(aktivitet)),
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
});

const mapStateToProps = state => ({
    lagrer: selectAktivitetStatus(state) !== STATUS.OK,
    formIsDirty: isDirty(formNavn)(state),
    aktivitetFeilmeldinger: selectAktivitetFeilmeldinger(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    AktivitetFormContainer
);
