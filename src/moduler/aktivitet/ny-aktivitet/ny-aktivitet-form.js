import React, { useEffect, useRef } from 'react';
import { Route, Switch } from 'react-router-dom';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { lagNyAktivitet } from '../aktivitet-actions';
import NyMoteAktivitet from '../aktivitet-forms/mote/ny-mote-aktivitet';
import { aktivitetRoute } from '../../../routing';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import { STATUS } from '../../../ducks/utils';
import {
    selectAktivitetFeilmeldinger,
    selectAktivitetStatus,
} from '../aktivitet-selector';
import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    SAMTALEREFERAT_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    STATUS_PLANLAGT,
    STILLING_AKTIVITET_TYPE,
} from '../../../constant';
import IJobbAktivitetForm from '../aktivitet-forms/ijobb/aktivitet-ijobb-form';
import { removeEmptyKeysFromObject } from '../../../utils/object';
import StillingAktivitetForm from '../aktivitet-forms/stilling/aktivitet-stilling-form';
import EgenAktivitetForm from '../aktivitet-forms/egen/aktivitet-egen-form';
import SamtalereferatForm from '../aktivitet-forms/samtalereferat/samtalereferat-form';
import BehandlingAktivitetForm from '../aktivitet-forms/behandling/aktivitet-behandling-form';
import SokeAvtaleAktivitetForm from '../aktivitet-forms/sokeavtale/aktivitet-sokeavtale-form';

const CONFIRM =
    'Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?';

function onBeforeLoadEffect(isDirty) {
    return () => {
        window.onbeforeunload = e => {
            if (isDirty.current) {
                e.returnValue = CONFIRM;
                return CONFIRM;
            }
            return undefined;
        };

        return () => {
            window.onbeforeunload = null;
        };
    };
}

function NyAktivitetForm(props) {
    const {
        onLagreNyAktivitet,
        lagrer,
        history,
        match,
        aktivitetFeilmeldinger,
    } = props;

    const isDirty = useRef(false);
    useEffect(onBeforeLoadEffect(isDirty), [isDirty]);

    function onLagre(aktivitet) {
        return onLagreNyAktivitet(aktivitet).then(action =>
            history.push(aktivitetRoute(action.data.id))
        );
    }

    const onSubmitFactory = aktivitetsType => {
        return aktivitet => {
            const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
            const nyAktivitet = {
                status: STATUS_PLANLAGT,
                type: aktivitetsType,
                ...filteredAktivitet,
            };
            return onLagreNyAktivitet(nyAktivitet).then(action =>
                history.push(aktivitetRoute(action.data.id))
            );
        };
    };

    function onRequestClose() {
        const isItReallyDirty = isDirty.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            history.push('/');
        }
    }

    const onReqBack = e => {
        e.preventDefault();
        const isItReallyDirty = isDirty.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            history.goBack();
        }
    };

    const header = (
        <ModalHeader
            tilbakeTekst="Tilbake til kategorier"
            onTilbakeClick={onReqBack}
        />
    );

    const formProps = {
        onLagreNyAktivitet: onLagre,
        isDirty,
        lagrer,
    };

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
                            <SamtalereferatForm
                                onSubmit={onSubmitFactory(SAMTALEREFERAT_TYPE)}
                                isDirtyRef={isDirty}
                            />
                        </Route>
                        <Route path={`${match.path}/stilling`}>
                            <StillingAktivitetForm
                                onSubmit={onSubmitFactory(
                                    STILLING_AKTIVITET_TYPE
                                )}
                                isDirtyRef={isDirty}
                            />
                        </Route>
                        <Route path={`${match.path}/sokeavtale`}>
                            <SokeAvtaleAktivitetForm
                                onSubmit={onSubmitFactory(
                                    SOKEAVTALE_AKTIVITET_TYPE
                                )}
                                isDirtyRef={isDirty}
                            />
                        </Route>
                        <Route path={`${match.path}/behandling`}>
                            <BehandlingAktivitetForm
                                onSubmit={onSubmitFactory(
                                    BEHANDLING_AKTIVITET_TYPE
                                )}
                                isDirtyRef={isDirty}
                            />
                        </Route>
                        <Route path={`${match.path}/egen`}>
                            <EgenAktivitetForm
                                onSubmit={onSubmitFactory(EGEN_AKTIVITET_TYPE)}
                                isDirtyRef={isDirty}
                            />
                        </Route>
                        <Route path={`${match.path}/ijobb`}>
                            <IJobbAktivitetForm
                                onSubmit={onSubmitFactory(IJOBB_AKTIVITET_TYPE)}
                                isDirtyRef={isDirty}
                            />
                        </Route>
                    </Switch>
                </ModalContainer>
            </article>
        </Modal>
    );
}

NyAktivitetForm.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    lagrer: PT.bool.isRequired,
    history: PT.object.isRequired,
    match: PT.object.isRequired,
    aktivitetFeilmeldinger: PT.array.isRequired,
};

const mapDispatchToProps = dispatch => ({
    onLagreNyAktivitet: aktivitet => dispatch(lagNyAktivitet(aktivitet)),
});

const mapStateToProps = state => ({
    lagrer: selectAktivitetStatus(state) !== STATUS.OK,
    aktivitetFeilmeldinger: selectAktivitetFeilmeldinger(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(NyAktivitetForm);
