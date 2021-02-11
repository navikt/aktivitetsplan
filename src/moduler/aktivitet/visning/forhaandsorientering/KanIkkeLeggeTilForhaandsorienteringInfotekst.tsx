import { AlertStripeInfo } from 'nav-frontend-alertstriper';
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
        <AlertStripeInfo>
            Du kan ikke legge til forhåndsorientering fordi sluttdatoen er færre enn 7 dager frem i tid.
        </AlertStripeInfo>
    );
};

export default KanIkkeLeggeTilForhaandsorienteringInfotekst;
