import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import RedigerArbeidslisteForm from './arbeidsliste-rediger-form';
import ModalContainer from '../../felles-komponenter/modal/modal-container';

function RedigerArbeidsliste({ navn }) {
    const fnr = getFodselsnummer();
    return (
        <article>
            <ModalContainer className="arbeidsliste__container">
                <Innholdstittel className="arbeidsliste__overskrift">
                    <FormattedMessage id="arbeidsliste.modal.rediger.overskrift" />
                </Innholdstittel>
                <Undertittel>
                    <FormattedMessage
                        id="arbeidsliste.modal.personalia"
                        values={{ navn, fnr }}
                    />
                </Undertittel>
            </ModalContainer>
            <RedigerArbeidslisteForm />
        </article>
    );
}

RedigerArbeidsliste.propTypes = {
    navn: PT.string.isRequired,
};

export default RedigerArbeidsliste;
