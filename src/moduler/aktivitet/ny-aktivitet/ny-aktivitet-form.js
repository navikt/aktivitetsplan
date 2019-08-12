import React, { useEffect, useRef } from 'react';
import { Route, Switch } from 'react-router-dom';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { isDirty } from 'redux-form';
import { lagNyAktivitet } from '../aktivitet-actions';
import SokeavtaleAktivitet from '../aktivitet-forms/sokeavtale/ny-aktivitet-sokeavtale';
import BehandlingAktivitet from '../aktivitet-forms/behandling/ny-aktivitet-behandling';
import NyMoteAktivitet from '../aktivitet-forms/mote/ny-mote-aktivitet';
import NyttSamtalereferat from '../aktivitet-forms/samtalereferat/nytt-samtalereferat';
import { aktivitetRoute } from '../../../routing';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import { formNavn } from '../aktivitet-forms/aktivitet-form-utils';
import { STATUS } from '../../../ducks/utils';
import {
    selectAktivitetFeilmeldinger,
    selectAktivitetStatus,
} from '../aktivitet-selector';
import {
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    STATUS_PLANLAGT,
    STILLING_AKTIVITET_TYPE,
} from '../../../constant';
import IJobbAktivitetForm from '../aktivitet-forms/ijobb/aktivitet-ijobb-form';
import { removeEmptyKeysFromObject } from '../../../utils/object';
import StillingAktivitetForm from '../aktivitet-forms/stilling/aktivitet-stilling-form';
import EgenAktivitetForm from '../aktivitet-forms/egen/aktivitet-egen-form';

const CONFIRM =
    'Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?';

function onBeforeLoadEffect(formIsDirty, formIsDirtyV2) {
    return () => {
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
    };
}

function NyAktivitetForm(props) {
    const {
        onLagreNyAktivitet,
        lagrer,
        formIsDirty,
        history,
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
            const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
            const nyAktivitet = {
                ...filteredAktivitet,
                type: aktivitetsType,
                status: STATUS_PLANLAGT,
            };
            return onLagreNyAktivitet(nyAktivitet).then(action =>
                history.push(aktivitetRoute(action.data.id))
            );
        };
    };

    function onRequestClose() {
        const isItReallyDirty = formIsDirty || formIsDirtyV2.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            history.push('/');
        }
    }

    const onReqBack = e => {
        e.preventDefault();
        const isItReallyDirty = formIsDirty || formIsDirtyV2.current;
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
        formIsDirty,
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
                            <NyttSamtalereferat {...formProps} />
                        </Route>
                        <Route path={`${match.path}/stilling`}>
                            <StillingAktivitetForm
                                onSubmit={onSubmitFactory(
                                    STILLING_AKTIVITET_TYPE
                                )}
                                isDirtyRef={formIsDirtyV2}
                            />
                        </Route>
                        <Route path={`${match.path}/sokeavtale`}>
                            <SokeavtaleAktivitet {...formProps} />
                        </Route>
                        <Route path={`${match.path}/behandling`}>
                            <BehandlingAktivitet {...formProps} />
                        </Route>
                        <Route path={`${match.path}/egen`}>
                            <EgenAktivitetForm
                                onSubmit={onSubmitFactory(EGEN_AKTIVITET_TYPE)}
                                isDirtyRef={formIsDirtyV2}
                            />
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

NyAktivitetForm.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    formIsDirty: PT.bool.isRequired,
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
    formIsDirty: isDirty(formNavn)(state),
    aktivitetFeilmeldinger: selectAktivitetFeilmeldinger(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(NyAktivitetForm);
