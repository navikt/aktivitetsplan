import { BodyShort } from '@navikt/ds-react';
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
            <BodyShort>{formaterDatoEllerTidSiden(aktivitet.endretDato)}</BodyShort>
        </div>
    );
};

export default VersjonInnslag;
