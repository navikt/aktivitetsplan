import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
    Innholdstittel,
    Normaltekst,
    Undertittel,
} from 'nav-frontend-typografi';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import LeggTilArbeidslisteForm from './arbeidsliste-legg-til-form';

function LeggTilArbeidsliste({ navn }) {
    const fnr = getFodselsnummer();
    return (
        <article>
            <Innholdstittel className="arbeidsliste__overskrift">
                <FormattedMessage id="arbeidsliste.modal.legg.til.overskrift" />
            </Innholdstittel>
            <Normaltekst>
                <FormattedMessage id="arbeidsliste.modal.legg.til.infotekst" />
            </Normaltekst>
            <Undertittel>
                <FormattedMessage
                    id="arbeidsliste.modal.personalia"
                    values={{ navn, fnr }}
                />
            </Undertittel>
            <LeggTilArbeidslisteForm />
        </article>
    );
}

LeggTilArbeidsliste.propTypes = {
    navn: PT.string.isRequired,
};

export default LeggTilArbeidsliste;
