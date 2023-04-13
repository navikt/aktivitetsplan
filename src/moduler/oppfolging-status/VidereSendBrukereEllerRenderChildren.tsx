import React, { useEffect } from 'react';

import { Oppfolgingsperiode } from '../../datatypes/oppfolgingTypes';
import { loggAntalVeiledere, loggingAntallBrukere } from '../../felles-komponenter/utils/logging';
import { useErVeileder } from '../../Provider';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/AktiverDigitalOppfolging';
import HarIkkeAktivitetsplan from './HarIkkeAktivitetsplan';

interface VidereSendBrukereEllerRenderChildrenProps {
    children: React.ReactNode;
    erVeileder: boolean;
    manuell: boolean;
    underOppfolging: boolean;
    reservasjonKRR: boolean;
    oppfolgingsPerioder: Oppfolgingsperiode[];
    servicegruppe: string;
    ident: string;
    aktorId: string;
}

const VidereSendBrukereEllerRenderChildren = (props: VidereSendBrukereEllerRenderChildrenProps) => {
    const { servicegruppe, underOppfolging, ident, aktorId, children, manuell, oppfolgingsPerioder, reservasjonKRR } =
        props;

    const erVeileder = useErVeileder();
    const ikkeDigitalOppfolging = reservasjonKRR || manuell;

    useEffect(() => {
        if (erVeileder) {
            loggAntalVeiledere(servicegruppe, underOppfolging, ident, aktorId);
        } else {
            loggingAntallBrukere(servicegruppe, underOppfolging, aktorId);
        }
    }, [ident, aktorId, servicegruppe, underOppfolging, erVeileder]);

    if (!underOppfolging && oppfolgingsPerioder.length === 0) {
        return <HarIkkeAktivitetsplan erVeileder={erVeileder} />;
    }

    if (!erVeileder && ikkeDigitalOppfolging) {
        return <AktiverDigitalOppfolging />;
    }

    return <>{children}</>;
};

export default VidereSendBrukereEllerRenderChildren;
