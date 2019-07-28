import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PT from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
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
import IJobbAktivitet from './ijobb/ny-aktivitet-ijobb';
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

class AktivitetFormContainer extends Component {
    componentDidMount() {
        window.onbeforeunload = this.visLukkDialog.bind(this);
    }

    componentWillUnmount() {
        window.onbeforeunload = null;
    }

    // eslint-disable-next-line consistent-return
    visLukkDialog(e) {
        const { formIsDirty, intl } = this.props;
        if (formIsDirty) {
            const melding = intl.formatMessage({
                id: 'aktkivitet-skjema.lukk-advarsel',
            });
            e.returnValue = melding;
            return melding;
        }
    }

    render() {
        const {
            onLagreNyAktivitet,
            lagrer,
            formIsDirty,
            history,
            intl,
            lukkModal,
            match,
            aktivitetFeilmeldinger,
        } = this.props;

        function onLagre(aktivitet) {
            return onLagreNyAktivitet(aktivitet).then(action =>
                history.push(aktivitetRoute(action.data.id))
            );
        }

        function onRequestClose() {
            const dialogTekst = intl.formatMessage({
                id: 'aktkivitet-skjema.lukk-advarsel',
            });

            // eslint-disable-next-line no-alert
            if (!formIsDirty || window.confirm(dialogTekst)) {
                history.push('/');
                lukkModal();
            }
        }

        const formProps = {
            onLagreNyAktivitet: onLagre,
            formIsDirty,
            lagrer,
        };

        return (
            <Modal
                header={
                    <ModalHeader
                        visConfirmDialog={formIsDirty}
                        tilbakeTekstId="ny-aktivitet-modal.tilbake"
                    />
                }
                key="behandlingAktivitetModal"
                onRequestClose={onRequestClose}
                contentLabel="aktivitet-modal"
                feilmeldinger={aktivitetFeilmeldinger}
            >
                <article aria-labelledby="modal-behandling-aktivitet-header">
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
                                <IJobbAktivitet {...formProps} />
                            </Route>
                        </Switch>
                    </ModalContainer>
                </article>
            </Modal>
        );
    }
}

AktivitetFormContainer.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    formIsDirty: PT.bool.isRequired,
    lagrer: PT.bool.isRequired,
    lukkModal: PT.func.isRequired,
    history: PT.object.isRequired,
    match: PT.object.isRequired,
    intl: intlShape.isRequired,
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
    injectIntl(AktivitetFormContainer)
);
