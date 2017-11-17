import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import {
    selectMotpartStatus,
    selectNavnPaMotpart,
} from '../motpart/motpart-selector';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import RedigerArbeidsliste from './arbeidsliste-rediger';
import FjernArbeidsliste from './arbeidsliste-fjern';
import LeggTilArbeidsliste from './arbeidsliste-legg-til';
import { selectArbeidslisteStatus } from './arbeidsliste-selector';
import { slettArbeidsliste } from './arbeidsliste-reducer';
import { LUKK_MODAL } from '../../felles-komponenter/modal/modal-reducer';
import Modal from '../../felles-komponenter/modal/modal';
import FnrProvider from './../../bootstrap/fnr-provider';

function ArbeidslisteContainer({
    avhengigheter,
    path,
    navnPaMotpart,
    onSlettArbeidsliste,
    history,
    lukkModal,
}) {
    const onLukkModal = () => {
        history.push('/');
        lukkModal();
    };

    return (
        <FnrProvider>
            <Modal
                contentLabel="arbeidsliste-modal"
                contentClass="arbeidsliste"
            >
                <Innholdslaster
                    avhengigheter={avhengigheter}
                    className="arbeidsliste__spinner"
                >
                    <Switch>
                        <Route exact path={`${path}/leggtil`}>
                            <LeggTilArbeidsliste navn={navnPaMotpart} />
                        </Route>
                        <Route exact path={`${path}/rediger`}>
                            <RedigerArbeidsliste navn={navnPaMotpart} />
                        </Route>
                        <Route exact path={`${path}/fjern`}>
                            <FjernArbeidsliste
                                navn={navnPaMotpart}
                                onBekreftSlett={onSlettArbeidsliste}
                                lukkModal={onLukkModal}
                            />
                        </Route>
                    </Switch>
                </Innholdslaster>
            </Modal>
        </FnrProvider>
    );
}

ArbeidslisteContainer.defaultProps = {
    navnPaMotpart: '',
};

ArbeidslisteContainer.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    path: PT.string.isRequired,
    navnPaMotpart: PT.string,
    history: PT.object.isRequired,
    onSlettArbeidsliste: PT.func.isRequired,
    lukkModal: PT.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    avhengigheter: [
        selectMotpartStatus(state),
        selectArbeidslisteStatus(state),
    ],
    path: ownProps.match.path,
    navnPaMotpart: selectNavnPaMotpart(state),
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            onSlettArbeidsliste: () => slettArbeidsliste(getFodselsnummer()),
            lukkModal: () => dispatch({ type: LUKK_MODAL }),
        },
        dispatch
    );

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ArbeidslisteContainer)
);
