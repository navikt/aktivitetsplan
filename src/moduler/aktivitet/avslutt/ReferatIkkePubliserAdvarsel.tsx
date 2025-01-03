import { Alert } from '@navikt/ds-react';
import React from 'react';

import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { MoteAktivitet, SamtalereferatAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { manglerPubliseringAvSamtaleReferat } from '../aktivitet-util';

interface Props {
    aktivitet: AlleAktiviteter;
    nyStatus: AktivitetStatus;
    children: JSX.Element | null;
}

const getManglerPubliseringTekst = (aktivitet: SamtalereferatAktivitet | MoteAktivitet): string => {
    switch (aktivitet.type) {
        case VeilarbAktivitetType.SAMTALEREFERAT_TYPE:
            return 'Du må dele referatet med brukeren før du kan sette aktiviteten til fullført eller avbrutt';
        case VeilarbAktivitetType.MOTE_TYPE:
            return 'Du må dele referatet med brukeren før du kan sette aktiviteten til fullført';
    }
};

const ReferatIkkePubliserAdvarsel = ({ aktivitet, nyStatus, children }: Props) => {
    if (manglerPubliseringAvSamtaleReferat(aktivitet, nyStatus)) {
        return (
            <Alert variant="error" inline>
                {getManglerPubliseringTekst(aktivitet)}
            </Alert>
        );
    }
    return children;
};

export default ReferatIkkePubliserAdvarsel;
