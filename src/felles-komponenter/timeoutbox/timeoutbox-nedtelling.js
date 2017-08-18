import React from 'react';
import PT from 'prop-types';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import ModalContainer from '../modal/modal-container';
import ModalFooter from '../modal/modal-footer';

function TimeoutboxNedtelling({ tidIgjen }) {
    return (
        <div>
            <ModalContainer>
                <div className="varselmodal">
                    <Innholdstittel className="blokk-s" tag="h1">
                        <FormattedMessage id="timeoutbox.tittel" />
                    </Innholdstittel>
                    <Normaltekst className="blokk-xxs">
                        <FormattedMessage
                            id="timeoutbox.innhold.nedtelling"
                            values={{ tid: tidIgjen.format('mm:ss') }}
                        />
                    </Normaltekst>
                </div>
            </ModalContainer>
            <ModalFooter>
                <Hovedknapp
                    className="modal-footer__knapp"
                    onClick={() => window.location.reload()}
                >
                    <FormattedMessage id="timeoutbox.knapp.fortsett" />
                </Hovedknapp>
                <Knapp
                    className="modal-footer__knapp"
                    onClick={() => document.querySelector('#logout').click()}
                >
                    <FormattedMessage id="timeoutbox.knapp.loggut" />
                </Knapp>
            </ModalFooter>
        </div>
    );
}

TimeoutboxNedtelling.propTypes = {
    tidIgjen: PT.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default TimeoutboxNedtelling;
