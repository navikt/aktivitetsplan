import { Hovedknapp } from 'nav-frontend-knapper';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import ModalContainer from '../modal/ModalContainer';
import ModalFooter from '../modal/ModalFooter';

const TimeoutboxLoggetUt = () => (
    <div>
        <ModalContainer>
            <div className="varselmodal">
                <Innholdstittel className="blokk-s" tag="h1">
                    Obs!
                </Innholdstittel>
                <Normaltekst className="blokk-xxs">
                    Sesjonen har utløpt. Du må logge inn igjen for å fortsette.
                </Normaltekst>
            </div>
        </ModalContainer>
        <ModalFooter>
            <Hovedknapp className="modal-footer__knapp" onClick={() => window.location.reload()}>
                Last siden på nytt
            </Hovedknapp>
        </ModalFooter>
    </div>
);

export default TimeoutboxLoggetUt;
