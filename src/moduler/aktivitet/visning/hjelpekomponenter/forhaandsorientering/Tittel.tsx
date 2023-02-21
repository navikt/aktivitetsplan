import { Alert, BodyShort, Label } from '@navikt/ds-react';
import React from 'react';

const AdvarselTittel = () => (
    <Alert variant="warning" inline>
        <Label>Informasjon om ansvaret ditt</Label>
    </Alert>
);

const NormalTittel = () => <BodyShort>Informasjon om ansvaret ditt</BodyShort>;

interface Props {
    kanMarkeresSomLest: boolean;
}

const Tittel = ({ kanMarkeresSomLest }: Props) => (kanMarkeresSomLest ? <AdvarselTittel /> : <NormalTittel />);

export default Tittel;
