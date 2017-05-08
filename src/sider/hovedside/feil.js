import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';
import * as AppPT from '../../proptypes';
import { visibleIfHOC } from '../../hocs/visible-if';
import { SKJUL_SISTE_FEIL_ACTION } from '../../ducks/feil';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import './feil.less';

const VisibleAlertStripeAdvarsel = visibleIfHOC(AlertStripeAdvarsel);

function Feil({ sisteFeil, sisteFeilSkjult, skjulFeil }) {
    return (
        <VisibleAlertStripeAdvarsel visible={!!sisteFeil && !sisteFeilSkjult} className="feil">
            <Lukknapp overstHjorne onClick={skjulFeil} />
            <Undertittel>Feil i aktivitetsplan - {sisteFeil && sisteFeil.type}</Undertittel>
            <VisibleIfDiv visible={sisteFeil && sisteFeil.detaljer} className="feil__detaljer">
                <pre>{sisteFeil && sisteFeil.detaljer}</pre>
            </VisibleIfDiv>
        </VisibleAlertStripeAdvarsel>
    );
}

Feil.propTypes = {
    skjulFeil: PT.func.isRequired,
    sisteFeil: AppPT.feil,
    sisteFeilSkjult: PT.bool.isRequired
};

Feil.defaultProps = {
    sisteFeil: undefined
};

const mapStateToProps = (state) => {
    const feilState = state.feil;
    return ({
        sisteFeil: feilState.sisteFeil,
        sisteFeilSkjult: feilState.sisteFeilSkjult
    });
};

const mapDispatchToProps = (dispatch) => ({
    skjulFeil: () => dispatch(SKJUL_SISTE_FEIL_ACTION)
});

export default connect(mapStateToProps, mapDispatchToProps)(Feil);
