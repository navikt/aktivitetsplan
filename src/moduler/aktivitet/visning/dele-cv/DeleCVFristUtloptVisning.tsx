import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import EkspanderbarLinje from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import { formaterDatoManed } from '../../../../utils';
import { Ingress } from './DeleCvContainer';

interface Props {
    overskrift: string;
    svarfrist: string;
}

export const DeleCVFristUtloptVisning = (props: Props) => {
    const { overskrift, svarfrist } = props;

    const Tittel = () => <BodyShort className="pr-4">{overskrift}</BodyShort>;
    const TittelMedUtloptTekst = () => (
        <>
            <Tittel />
            <BodyShort className="pr-4">Fristen har gått ut</BodyShort>
        </>
    );

    return (
        <EkspanderbarLinje
            tittel={<TittelMedUtloptTekst />}
            aapneTittel={<Tittel />}
            kanToogle
            aapneTekst="Åpne"
            lukkeTekst="Lukk"
        >
            <Ingress />
            <BodyShort className="mt-4">
                Spørsmålet ble ikke besvart innen fristen {formaterDatoManed(svarfrist)}
            </BodyShort>
        </EkspanderbarLinje>
    );
};
