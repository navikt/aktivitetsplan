import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import StartProsess from '../prosesser/start-prosess';
import { SLETT_BEGRUNNELSE_ACTION } from '../innstillinger-reducer';
import * as AppPT from '../../../proptypes';

function SettManuellOppfolgingProsess({ slettBegrunnelse }) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittelId="innstillinger.prosess.manuell.tittel"
            knappetekstId="innstillinger.modal.prosess.start.knapp"
            onClick={() => slettBegrunnelse()}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.manuell.tekst" />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}

SettManuellOppfolgingProsess.propTypes = {
    slettBegrunnelse: PT.func.isRequired,
    history: AppPT.history.isRequired,
};

const mapDispatchToProps = (dispatch, props) => ({
    slettBegrunnelse: () => {
        dispatch(SLETT_BEGRUNNELSE_ACTION);
        props.history.push('/innstillinger/manuell');
    },
});

export default withRouter(
    connect(null, mapDispatchToProps)(hiddenIfHoc(SettManuellOppfolgingProsess))
);
