import StoreForbokstaver from '../../../felles-komponenter/utils/store-forbokstaver';
import React from 'react';
import { Bruker } from '../../../types';

interface Props {
    bruker: Bruker;
}

function Adresse(props: Props) {
    const { bostedsadresse } = props.bruker;
    const strukturertAdresse = bostedsadresse && bostedsadresse.strukturertAdresse;
    const gateadresse = strukturertAdresse && strukturertAdresse.Gateadresse;
    if (!gateadresse) {
        return <div />;
    }
    const { gatenavn, poststed, husbokstav, husnummer, postnummer } = gateadresse;
    return (
        <div>
            <StoreForbokstaver tag="div">{`${gatenavn} ${husnummer} ${husbokstav || ''}`}</StoreForbokstaver>
            <StoreForbokstaver tag="div">{`${postnummer} ${poststed}`}</StoreForbokstaver>
        </div>
    );
}

export default Adresse;
