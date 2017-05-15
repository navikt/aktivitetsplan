import React from 'react';
import PT from 'prop-types';
import { Normaltekst, EtikettStor } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Lenke from './utils/lenke';

const datoklasse = 'aktivitetvisning-info aktivitetsdato__tekst';
const erDatoSatt = (fraDato, tilDato) => fraDato === '' || tilDato === '';

const visDato = (fraDato, tilDato) => (
    <Normaltekst className={datoklasse}>
        <FormattedMessage id="aktivitetsdato.vis-dato" values={{ fraDato, tilDato }} />
    </Normaltekst>);

const visSettDato = () => (
    <Lenke href="/" className={datoklasse}>
        <FormattedMessage id="aktivitetsdato.vis-sett-dato" />
    </Lenke>
);

function Aktivitetsdato({ fra, til }) {
    return (
        <div className="aktivitetsdato">
            <EtikettStor className="aktivitetvisning-etikett aktivitetsdato__etikett">
                <FormattedMessage id="aktivitetsdato.dato-etikett" />
            </EtikettStor>
            {erDatoSatt(fra, til) ? visDato(fra, til) : visSettDato()}
        </div>
    );
}

Aktivitetsdato.propTypes = {
    fra: PT.string,
    til: PT.string
};

export default Aktivitetsdato;
