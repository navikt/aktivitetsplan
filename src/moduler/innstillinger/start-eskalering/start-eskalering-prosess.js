import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { withRouter } from 'react-router-dom';
import StartProsess from '../prosesser/start-prosess';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import { SLETT_BEGRUNNELSE_ACTION } from '../innstillinger-reducer';
import * as AppPT from '../../../proptypes';

function StartEskaleringProsess({ slettBegrunnelse, history }) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittelId="innstillinger.prosess.start-eskalering.tittel"
            knappetekstId="innstillinger.modal.prosess.start.knapp"
            onClick={() => {
                slettBegrunnelse();
                history.push('/innstillinger/startEskalering/');
            }}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.start-eskalering.tekst" />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}

StartEskaleringProsess.propTypes = {
    slettBegrunnelse: PT.func.isRequired,
    history: AppPT.history.isRequired,
};

const mapDispatchToProps = dispatch => ({
    slettBegrunnelse: () => {
        dispatch(SLETT_BEGRUNNELSE_ACTION);
    },
});

export default withRouter(
    connect(null, mapDispatchToProps)(hiddenIfHoc(StartEskaleringProsess))
);
