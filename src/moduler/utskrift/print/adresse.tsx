import React from 'react';

import { Postadresse } from '../../../datatypes/types';
import StoreForbokstaver from '../../../felles-komponenter/utils/StoreForbokstaver';

interface Props {
    adresse: Postadresse;
}

function Adresse(props: Props) {
    const adresselinje1 = props.adresse.adresselinje1;
    const postnummer = props.adresse.postnummer;
    const poststed = props.adresse.poststed;

    if (!adresselinje1) {
        return <div />;
    }
    return (
        <div>
            <StoreForbokstaver tag="div">{`${adresselinje1}`}</StoreForbokstaver>
            <StoreForbokstaver tag="div">{`${postnummer} ${poststed}`}</StoreForbokstaver>
        </div>
    );
}

export default Adresse;
