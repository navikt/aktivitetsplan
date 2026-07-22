import { Alert } from '@navikt/ds-react';
import React from 'react';

import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { MoteAktivitet, SamtalereferatAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { manglerPubliseringAvSamtaleReferat } from '../aktivitet-util';

interface Props {
    aktivitet: AlleAktiviteter;
    nyStatus: AktivitetStatus;
    children: React.ReactNode | null;
}

const getManglerPubliseringTekst = (aktivitet: SamtalereferatAktivitet | MoteAktivitet): string => {
    switch (aktivitet.type) {
        case VeilarbAktivitetType.SAMTALEREFERAT_TYPE:
            return 'Du må dele referatet med brukeren før du kan sette aktiviteten til fullført eller avbrutt';
        case VeilarbAktivitetType.MOTE_TYPE:
            return 'Du må dele referatet med brukeren før du kan sette aktiviteten til fullført';
    }
};

const ReferatIkkePubliserAdvarsel = ({ aktivitet, children }: Props) => {
    const erPubliserbar =
        aktivitet.type == VeilarbAktivitetType.MOTE_TYPE || aktivitet.type == VeilarbAktivitetType.SAMTALEREFERAT_TYPE;
    const skalViseIkkePubliserAdvarsel =
        aktivitet && erPubliserbar ? manglerPubliseringAvSamtaleReferat(aktivitet, AktivitetStatus.AVBRUTT) : false;
    if (erPubliserbar && skalViseIkkePubliserAdvarsel) {
        return (
            <Alert variant="error" inline>
                {getManglerPubliseringTekst(aktivitet)}
            </Alert>
        );
    } else {
        return children;
    }
};

export default ReferatIkkePubliserAdvarsel;
