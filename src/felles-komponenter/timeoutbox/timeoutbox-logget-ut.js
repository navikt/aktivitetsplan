import React from 'react';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import ModalContainer from '../modal/modal-container';
import ModalFooter from '../modal/modal-footer';

function TimeoutboxLoggetUt() {
    return (
        <div>
            <ModalContainer>
                <div className="varselmodal">
                    <Innholdstittel className="blokk-s" tag="h1">
                        <FormattedMessage id="timeoutbox.tittel" />
                    </Innholdstittel>
                    <Normaltekst className="blokk-xxs">
                        <FormattedMessage id="timeoutbox.innhold.loggetut" />
                    </Normaltekst>
                </div>
            </ModalContainer>
            <ModalFooter>
                <Hovedknapp
                    className="modal-footer__knapp"
                    onClick={() => window.location.reload()}
                >
                    <FormattedMessage id="timeoutbox.knapp.last_pa_nytt" />
                </Hovedknapp>
            </ModalFooter>
        </div>
    );
}

export default TimeoutboxLoggetUt;
