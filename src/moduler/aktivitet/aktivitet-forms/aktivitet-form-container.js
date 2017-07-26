import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import PT from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { isDirty } from 'redux-form';
import { lagNyAktivitet } from '../aktivitet-actions';
import { LUKK_MODAL } from '../../../ducks/modal';
import StillingAktivitet from './stilling/ny-aktivitet-stilling';
import SokeavtaleAktivitet from './sokeavtale/ny-aktivitet-sokeavtale';
import BehandlingAktivitet from './behandling/ny-aktivitet-behandling';
import EgenAktivitet from './egen/ny-aktivitet-egen';
import { aktivitetRoute } from '../../../routing';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';

export const formNavn = 'ny-aktivitet-form';

function AktivitetFormContainer({
    onLagreNyAktivitet,
    formIsDirty,
    history,
    intl,
    lukkModal,
    match,
}) {
    function onLagre(aktivitet) {
        onLagreNyAktivitet(aktivitet).then(action =>
            history.push(aktivitetRoute(action.data.id))
        );
    }

    function onRequestClose() {
        const dialogTekst = intl.formatMessage({
            id: 'aktkivitet-skjema.lukk-advarsel',
        });

        // eslint-disable-next-line no-alert
        if (!formIsDirty || confirm(dialogTekst)) {
            history.push('/');
            lukkModal();
        }
    }

    const formProps = {
        onLagreNyAktivitet: onLagre,
        formIsDirty,
    };

    return (
        <Modal
            isOpen
            key="behandlingAktivitetModal"
            onRequestClose={onRequestClose}
            contentLabel="aktivitet-modal"
        >
            <article aria-labelledby="modal-behandling-aktivitet-header">
                <ModalHeader
                    visConfirmDialog={formIsDirty}
                    tilbakeTekstId="ny-aktivitet-modal.tilbake"
                />
                <ModalContainer>
                    <Switch>
                        <Route path={`/${match.url}/stilling`}>
                            <StillingAktivitet {...formProps} />
                        </Route>
                        <Route path={`/${match.url}/sokeavtale`}>
                            <SokeavtaleAktivitet {...formProps} />
                        </Route>
                        <Route path={`/${match.url}/behandling`}>
                            <BehandlingAktivitet {...formProps} />
                        </Route>
                        <Route path={`/${match.url}/egen`}>
                            <EgenAktivitet {...formProps} />
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
    lukkModal: PT.func.isRequired,
    history: PT.object.isRequired,
    match: PT.object.isRequired,
    intl: intlShape.isRequired,
};

const mapDispatchToProps = dispatch => ({
    onLagreNyAktivitet: aktivitet => dispatch(lagNyAktivitet(aktivitet)),
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
});

const mapStateToProps = state => ({
    formIsDirty: isDirty(formNavn)(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    withRouter(injectIntl(AktivitetFormContainer))
);
