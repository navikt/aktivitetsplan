import React from 'react';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import ModalContainer from '../../modal/modal-container';
import ModalFooter from '../../modal/modal-footer';

const TimeoutboxLoggetUt = () => (
    <div>
        <ModalContainer>
            <div className="varselmodal">
                <Innholdstittel className="blokk-m" tag="h1">
                    <FormattedMessage id="timeoutbox.tittel" />
                </Innholdstittel>
                <Normaltekst>
                    <FormattedMessage id="timeoutbox.innhold.loggetut" />
                </Normaltekst>
            </div>
        </ModalContainer>
        <ModalFooter>
            <Knapp
                className="modal-footer__knapp"
                mini
                onClick={() => window.location.reload()}
            >
                <FormattedMessage id="timeoutbox.knapp.fortsett" />
            </Knapp>
        </ModalFooter>
    </div>
);

export default TimeoutboxLoggetUt;
