import React from 'react';

import { Postadresse } from '../../../datatypes/types';
import StoreForbokstaver from '../../../felles-komponenter/utils/StoreForbokstaver';

interface Props {
    adresse: Postadresse;
}

function Adresse({ adresse }: Props) {
    const adresselinje1 = adresse.adresselinje1;
    const postnummer = adresse.postnummer;
    const poststed = adresse.poststed;

    if (!adresselinje1) {
        return <div />;
    }
    return (
        <div>
            <StoreForbokstaver tag="div">{`${adresselinje1}`}</StoreForbokstaver>
            {adresse.adresselinje2 && <StoreForbokstaver tag="div">{`${adresse.adresselinje2}`}</StoreForbokstaver>}
            {adresse.adresselinje3 && <StoreForbokstaver tag="div">{`${adresse.adresselinje3}`}</StoreForbokstaver>}
            <StoreForbokstaver tag="div">{`${postnummer} ${poststed}`}</StoreForbokstaver>

            {adresse.land && adresse.type !== 'NORSKPOSTADRESSE' && (
                <StoreForbokstaver tag="div">{`${adresse.land}`}</StoreForbokstaver>
            )}
        </div>
    );
}

export default Adresse;
