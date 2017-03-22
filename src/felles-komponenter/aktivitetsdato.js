import React, { PropTypes as PT } from 'react';
import { Normaltekst, EtikettStor } from 'nav-frontend-typografi';
import Lenke from './utils/lenke';

const datoklasse = 'aktivitetvisning-info aktivitetsdato__tekst';
const erDatoSatt = (fraDato, tilDato) => fraDato === '' || tilDato === '';
const visDato = (fraDato, tilDato) => <Normaltekst className={datoklasse}>{fraDato} - {tilDato}</Normaltekst>;
const visSettDato = () => <Lenke href="/" className={datoklasse}>Legg inn til og fra dato</Lenke>;

function Aktivitetsdato({ fra, til }) {
    return (
        <div className="aktivitetsdato">
            <EtikettStor className="aktivitetvisning-etikett aktivitetsdato__etikett">dato</EtikettStor>
            {erDatoSatt(fra, til) ? visDato(fra, til) : visSettDato()}
        </div>
    );
}

Aktivitetsdato.propTypes = {
    fra: PT.string,
    til: PT.string
};

export default Aktivitetsdato;
