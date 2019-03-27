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
import { selectFeatureData } from '../../../felles-komponenter/feature/feature-selector';
import { MANUELL_REGISTRERING } from '../../../felles-komponenter/feature/feature';
import { getEnhetFromUrl } from '../opprett-oppgave/opprett-oppgave-utils';
import { selectBruker } from '../../bruker/bruker-selector';
import { lagRegistreringUrl } from '../url-utils';

function StartOppfolgingProsess({
    slettBegrunnelse,
    history,
    manuellRegistreringPa,
    bruker,
}) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittelId="innstillinger.prosess.startoppfolging.tittel"
            knappetekstId="innstillinger.modal.prosess.start.knapp"
            onClick={() => {
                if (manuellRegistreringPa) {
                    window.location.href = lagRegistreringUrl(
                        bruker.fodselsnummer,
                        getEnhetFromUrl()
                    );
                } else {
                    slettBegrunnelse();
                    history.push('/innstillinger/start/bekreft/');
                }
            }}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.startoppfolging.tekst" />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}

StartOppfolgingProsess.propTypes = {
    bruker: AppPT.bruker.isRequired,
    manuellRegistreringPa: PT.bool.isRequired,
    slettBegrunnelse: PT.func.isRequired,
    history: AppPT.history.isRequired,
};

const mapStateToProps = state => ({
    bruker: selectBruker(state),
    manuellRegistreringPa: selectFeatureData(state)[MANUELL_REGISTRERING],
});

const mapDispatchToProps = dispatch => ({
    slettBegrunnelse: () => {
        dispatch(SLETT_BEGRUNNELSE_ACTION);
    },
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        hiddenIfHoc(StartOppfolgingProsess)
    )
);
