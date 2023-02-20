import { Alert } from '@navikt/ds-react';
import React from 'react';

interface Props {
    merEnnSyvDagerTil: boolean;
}

const KanIkkeLeggeTilForhaandsorienteringInfotekst = (props: Props) => {
    const { merEnnSyvDagerTil } = props;

    if (merEnnSyvDagerTil) {
        return null;
    }

    return (
        <Alert variant="info">
            Du kan ikke legge til forhåndsorientering fordi sluttdatoen er færre enn 7 dager frem i tid.
        </Alert>
    );
};

export default KanIkkeLeggeTilForhaandsorienteringInfotekst;
