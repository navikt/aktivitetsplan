import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import history from '../../../history';
import StartProsess from '../prosesser/start-prosess';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import { hentBehandlendeEnheter } from '../../../moduler/innstillinger/innstillinger-reducer';
import { getFodselsnummer } from '../../../bootstrap/fnr-util';

function OpprettOppgaveProsess({ hentEnheter }) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittelId="innstillinger.prosess.opprett-oppgave.tittel"
            knappetekstId="innstillinger.modal.prosess.start.knapp"
            onClick={() => {
                hentEnheter(getFodselsnummer());
                history.push('/innstillinger/oppgave/opprett');
            }}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.opprett-oppgave.tekst" />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}

const mapDispatchToProps = dispatch => ({
    hentEnheter: fnr => dispatch(hentBehandlendeEnheter(fnr)),
});

export default connect(null, mapDispatchToProps)(
    hiddenIfHoc(OpprettOppgaveProsess)
);
