import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
    Innholdstittel,
    Normaltekst,
    Undertittel,
} from 'nav-frontend-typografi';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import RedigerArbeidslisteForm from './arbeidsliste-rediger-form';

function RedigerArbeidsliste({ navn }) {
    const fnr = getFodselsnummer();
    return (
        <article>
            <Innholdstittel className="arbeidsliste__overskrift">
                <FormattedMessage id="arbeidsliste.modal.rediger.overskrift" />
            </Innholdstittel>
            <Normaltekst>
                <FormattedMessage id="arbeidsliste.modal.rediger.infotekst" />
            </Normaltekst>
            <Undertittel>
                <FormattedMessage
                    id="arbeidsliste.modal.personalia"
                    values={{ navn, fnr }}
                />
            </Undertittel>
            <RedigerArbeidslisteForm />
        </article>
    );
}

RedigerArbeidsliste.propTypes = {
    navn: PT.string.isRequired,
};

export default RedigerArbeidsliste;
