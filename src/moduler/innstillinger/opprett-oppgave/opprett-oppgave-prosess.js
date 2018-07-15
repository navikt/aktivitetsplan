import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { withRouter } from 'react-router-dom';
import StartProsess from '../prosesser/start-prosess';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import * as AppPT from '../../../proptypes';

function OpprettOppgaveProsess({ motpart, history }) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittelId="innstillinger.prosess.opprett-oppgave.tittel"
            knappetekstId="innstillinger.modal.prosess.start.knapp"
            onClick={() => {
                history.push('/innstillinger/oppgave/opprett');
            }}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage
                        id="innstillinger.prosess.opprett-oppgave.tekst"
                        values={{
                            navn: motpart.data.navn,
                        }}
                    />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}

OpprettOppgaveProsess.propTypes = {
    motpart: AppPT.motpart.isRequired,
    history: AppPT.history.isRequired,
};

export default withRouter(hiddenIfHoc(OpprettOppgaveProsess));
