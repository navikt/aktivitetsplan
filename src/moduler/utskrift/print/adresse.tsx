import React from 'react';

import { Postadresse } from '../../../datatypes/types';
import StoreForbokstaver from '../../../felles-komponenter/utils/StoreForbokstaver';

interface AdresseProps {
    adresse: Postadresse;
}

function Adresse({ adresse }: AdresseProps) {
    const adresselinje1 = adresse.adresselinje1;

    if (!adresselinje1) {
        return <div />;
    }
    return (
        <div>
            <StoreForbokstaver tag="div">{`${adresselinje1}`}</StoreForbokstaver>
            {adresse.adresselinje2 && <StoreForbokstaver tag="div">{`${adresse.adresselinje2}`}</StoreForbokstaver>}
            {adresse.adresselinje3 && <StoreForbokstaver tag="div">{`${adresse.adresselinje3}`}</StoreForbokstaver>}
            {adresse.postnummer && adresse.poststed && (
                <StoreForbokstaver tag="div">{`${adresse.postnummer} ${adresse.poststed}`}</StoreForbokstaver>
            )}
            {adresse.land && adresse.type !== 'NORSKPOSTADRESSE' && (
                <StoreForbokstaver tag="div">{`${adresse.land}`}</StoreForbokstaver>
            )}
        </div>
    );
}

export default Adresse;
