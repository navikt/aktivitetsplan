import { BodyShort } from '@navikt/ds-react';
import { format } from 'date-fns';
import React from 'react';

import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { formaterDatoEllerTidSiden } from '../../../../utils/dateUtils';
import Endringstekst from './Endringstekst';

interface Props {
    aktivitet: VeilarbAktivitet;
    forrigeAktivitet?: VeilarbAktivitet;
}

const VersjonInnslag = (props: Props) => {
    const { aktivitet, forrigeAktivitet } = props;

    return (
        <div className="m-0 pb-4">
            <Endringstekst aktivitet={aktivitet} forrigeAktivitet={forrigeAktivitet} />
            <BodyShort>
                {aktivitet.endretDato ? formaterDatoEllerTidSiden(aktivitet.endretDato) : 'Ingen endret dato funnet'}
            </BodyShort>
        </div>
    );
};

export default VersjonInnslag;
