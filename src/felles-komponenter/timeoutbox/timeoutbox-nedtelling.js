import React from 'react';
import PT from 'prop-types';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import ModalContainer from '../modal/modal-container';
import ModalFooter from '../modal/modal-footer';
import { moment } from '../../utils';

function TimeoutboxNedtelling({ sekunderIgjen }) {
    const duration = moment.duration(sekunderIgjen, 'seconds');
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
                            values={{ tid: duration.format('mm:ss') }}
                        />
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
    sekunderIgjen: PT.number.isRequired,
};

export default TimeoutboxNedtelling;
