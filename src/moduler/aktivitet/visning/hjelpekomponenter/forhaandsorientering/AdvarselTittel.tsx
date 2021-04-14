import AlertStripe from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';
import React from 'react';

const AdvarselTittel = () => (
    <AlertStripe type="advarsel" form="inline">
        <Element>Informasjon om ansvaret ditt</Element>
    </AlertStripe>
);

export default AdvarselTittel;
