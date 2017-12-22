import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import StartProsess from '../prosesser/start-prosess';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import history from '../../../history';
import { SLETT_BEGRUNNELSE_ACTION } from '../innstillinger-reducer';

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
};

const mapDispatchToProps = dispatch => ({
    slettBegrunnelse: () => {
        dispatch(SLETT_BEGRUNNELSE_ACTION);
        history.push('/innstillinger/stoppKvpPeriode');
    },
});

export default connect(null, mapDispatchToProps)(
    hiddenIfHoc(StoppKvpPeriodeProsess)
);
