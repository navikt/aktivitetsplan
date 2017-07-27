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

function ArbeidslisteContainer({ navnPaMotpart, match }) {
    return (
        <StandardModal name="arbeidslisteModal">
            <ModalHeader />
            <article className="arbeidsliste__container">
                <Innholdslaster
                    avhengigheter={[]} // TODO: avhengigheter={[motpart]}
                    className="arbeidsliste__spinner"
                >
                    <Switch>
                        <Route exact path={`${match.path}/leggtil`}>
                            <LeggTilArbeidsliste navn="oscar" />
                        </Route>
                        <Route exact path={`${match.path}/rediger`}>
                            <RedigerArbeidsliste navn="steffen" />
                        </Route>
                        <Route exact path={`${match.path}/fjern`}>
                            <FjernArbeidsliste navn={navnPaMotpart} />
                        </Route>
                    </Switch>
                </Innholdslaster>
            </article>
        </StandardModal>
    );
}

ArbeidslisteContainer.defaultProps = {
    navnPaMotpart: undefined,
};

ArbeidslisteContainer.propTypes = {
    navnPaMotpart: PT.string,
    motpart: AppPT.reducer.isRequired,
    match: PT.object.isRequired,
};

const mapStateToProps = state => ({
    motpart: hentMotpart(state),
    navnPaMotpart: hentNavnPaMotpart(state),
});

export default connect(mapStateToProps)(withRouter(ArbeidslisteContainer));
