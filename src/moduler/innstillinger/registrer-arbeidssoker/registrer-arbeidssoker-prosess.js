import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import { Normaltekst } from 'nav-frontend-typografi';
import StartProsess from '../prosesser/start-prosess';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import * as AppPT from '../../../proptypes';
import { selectBruker } from '../../bruker/bruker-selector';
import { getEnhetFromUrl } from '../opprett-oppgave/opprett-oppgave-utils';
import { lagRegistreringUrl } from '../url-utils';
import { selectKanReaktiveres } from '../../oppfolging-status/oppfolging-selector';

function RegistrerArbeidssokerProsess({ bruker, kanReaktiveres }) {
    const tittelId = kanReaktiveres
        ? 'innstillinger.prosess.reaktiver-arbeidssoker.tittel'
        : 'innstillinger.prosess.registrer-arbeidssoker.tittel';

    return (
        <StartProsess
            className="innstillinger__prosess"
            tittelId={tittelId}
            knappetekstId="innstillinger.modal.prosess.start.knapp"
            onClick={() => {
                window.location.href = lagRegistreringUrl(
                    bruker.fodselsnummer,
                    getEnhetFromUrl()
                );
            }}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.registrer-arbeidssoker.tekst" />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}

const mapStateToProps = state => ({
    bruker: selectBruker(state),
    kanReaktiveres: selectKanReaktiveres(state),
});

RegistrerArbeidssokerProsess.propTypes = {
    bruker: AppPT.bruker.isRequired,
    kanReaktiveres: PT.bool.isRequired,
};

export default withRouter(
    connect(mapStateToProps)(hiddenIfHoc(RegistrerArbeidssokerProsess))
);
