import { Alert } from '@navikt/ds-react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

const AdvarselTittel = () => (
    <Alert variant="warning" inline>
        <Element>Informasjon om ansvaret ditt</Element>
    </Alert>
);

const NormalTittel = () => <Normaltekst>Informasjon om ansvaret ditt</Normaltekst>;

interface Props {
    kanMarkeresSomLest: boolean;
}

const Tittel = ({ kanMarkeresSomLest }: Props) => (kanMarkeresSomLest ? <AdvarselTittel /> : <NormalTittel />);

export default Tittel;
