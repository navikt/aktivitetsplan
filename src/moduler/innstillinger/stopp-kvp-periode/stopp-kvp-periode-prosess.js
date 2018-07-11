import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import StartProsess from '../prosesser/start-prosess';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import { SLETT_BEGRUNNELSE_ACTION } from '../innstillinger-reducer';
import * as AppPT from '../../../proptypes';

function StoppKvpPeriodeProsess({ slettBegrunnelse }) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittelId="innstillinger.prosess.stopp-kvp.tittel"
            knappetekstId="innstillinger.modal.prosess.start.knapp"
            onClick={() => slettBegrunnelse()}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.stopp-kvp.tekst" />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}

StoppKvpPeriodeProsess.propTypes = {
    slettBegrunnelse: PT.func.isRequired,
    history: AppPT.history.isRequired,
};

const mapDispatchToProps = (dispatch, props) => ({
    slettBegrunnelse: () => {
        dispatch(SLETT_BEGRUNNELSE_ACTION);
        props.history.push('/innstillinger/stoppKvpPeriode');
    },
});

export default withRouter(
    connect(null, mapDispatchToProps)(hiddenIfHoc(StoppKvpPeriodeProsess))
);
