import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { hentMotpart, hentNavnPaMotpart } from '../motpart/motpart-selectors';
import StandardModal from '../../felles-komponenter/modal/modal-standard';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import RedigerArbeidsliste from './arbeidsliste-rediger';
import FjernArbeidsliste from './arbeidsliste-fjern';
import LeggTilArbeidsliste from './arbeidsliste-legg-til';
import { hentArbeidslisteReducer } from './arbeidsliste-selector';

function ArbeidslisteContainer({ navnPaMotpart, path, arbeidslisteReducer }) {
    return (
        <StandardModal name="arbeidslisteModal">
            <ModalHeader />
            <Innholdslaster
                avhengigheter={[arbeidslisteReducer]} // TODO: avhengigheter={[motpart]}
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
                        <FjernArbeidsliste navn={navnPaMotpart} />
                    </Route>
                </Switch>
            </Innholdslaster>
        </StandardModal>
    );
}

ArbeidslisteContainer.defaultProps = {
    navnPaMotpart: '', // TODO: slett denne
};

ArbeidslisteContainer.propTypes = {
    navnPaMotpart: PT.string,
    motpart: AppPT.reducer.isRequired,
    arbeidslisteReducer: AppPT.reducer.isRequired,
    path: PT.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    motpart: hentMotpart(state),
    path: ownProps.match.path,
    navnPaMotpart: hentNavnPaMotpart(state),
    arbeidslisteReducer: hentArbeidslisteReducer(state),
});

export default withRouter(connect(mapStateToProps)(ArbeidslisteContainer));
