import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { hentMotpart, hentNavnPaMotpart } from '../motpart/motpart-selectors';
import StandardModal from '../../felles-komponenter/modal/modal-standard';
import RedigerArbeidsliste from './arbeidsliste-rediger';
import FjernArbeidsliste from './arbeidsliste-fjern';
import LeggTilArbeidsliste from './arbeidsliste-legg-til';

function ArbeidslisteContainer({ motpart, navnPaMotpart }) {
    return (
        <StandardModal name="arbeidslisteModal">
            <article className="arbeidsliste__container">
                <Innholdslaster
                    avhengigheter={[motpart]}
                    className="arbeidsliste__spinner"
                >
                    <Switch>
                        <Route exact path="/leggtil">
                            <LeggTilArbeidsliste navn={navnPaMotpart} />
                        </Route>
                        <Route exact path="/rediger">
                            <RedigerArbeidsliste navn={navnPaMotpart} />
                        </Route>
                        <Route exact path="/fjern">
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
};

const mapStateToProps = state => ({
    motpart: hentMotpart(state),
    navnPaMotpart: hentNavnPaMotpart(state),
});

export default connect(mapStateToProps)(ArbeidslisteContainer);
