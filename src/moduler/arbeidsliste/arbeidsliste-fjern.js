import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
    Innholdstittel,
    Normaltekst,
    Undertittel,
} from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import ModalFooter from '../../felles-komponenter/modal/modal-footer';
import ModalContainer from '../../felles-komponenter/modal/modal-container';

function FjernArbeidsliste({ navn, onBekreftSlett, lukkModal }) {
    const fnr = getFodselsnummer();
    return (
        <section>
            <ModalContainer className="arbeidsliste__container">
                <Innholdstittel className="arbeidsliste__overskrift">
                    <FormattedMessage id="arbeidsliste.modal.fjern.overskrift" />
                </Innholdstittel>
                <Normaltekst>
                    <FormattedMessage id="arbeidsliste.modal.fjern.infotekst" />
                </Normaltekst>
                <Undertittel>
                    <FormattedMessage
                        id="arbeidsliste.modal.personalia"
                        values={{ navn, fnr }}
                    />
                </Undertittel>
            </ModalContainer>
            <ModalFooter>
                <Hovedknapp
                    mini
                    htmlType="button"
                    onClick={() => {
                        onBekreftSlett();
                        lukkModal();
                    }}
                >
                    <FormattedMessage id="arbeidsliste.knapp.bekreft" />
                </Hovedknapp>
                <Knapp
                    mini
                    htmlType="button"
                    onClick={() => {
                        lukkModal();
                    }}
                >
                    <FormattedMessage id="arbeidsliste.knapp.avbryt" />
                </Knapp>
            </ModalFooter>
        </section>
    );
}

FjernArbeidsliste.propTypes = {
    navn: PT.string.isRequired,
    onBekreftSlett: PT.func.isRequired,
    lukkModal: PT.func.isRequired,
};

export default FjernArbeidsliste;
