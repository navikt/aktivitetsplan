import AlertStripe from 'nav-frontend-alertstriper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

const AdvarselTittel = () => (
    <AlertStripe type="advarsel" form="inline">
        <Element>Informasjon om ansvaret ditt</Element>
    </AlertStripe>
);

const NormalTittel = () => <Normaltekst>Informasjon om ansvaret ditt</Normaltekst>;

interface Props {
    kanMarkeresSomLest: boolean;
}

const Tittel = ({ kanMarkeresSomLest }: Props) => (kanMarkeresSomLest ? <AdvarselTittel /> : <NormalTittel />);

export default Tittel;
