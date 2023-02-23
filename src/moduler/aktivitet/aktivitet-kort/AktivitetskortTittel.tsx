import { Heading } from '@navikt/ds-react';
import React from 'react';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import NotifikasjonMarkering from '../../../felles-komponenter/utils/NotifikasjonMarkering';

interface Props {
    aktivitet: AlleAktiviteter;
    harEndring: boolean;
    id: string;
}

export default function Aktivitetskorttittel({ aktivitet, harEndring, id }: Props) {
    return (
        <div className="flex items-baseline">
            <NotifikasjonMarkering visible={harEndring} />
            <Heading level="3" id={id} size="xsmall">
                {aktivitet.tittel}
            </Heading>
        </div>
    );
}
