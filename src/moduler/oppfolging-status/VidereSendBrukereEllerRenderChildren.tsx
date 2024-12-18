import React, { useEffect } from 'react';

import { loggAntalVeiledere, loggingAntallBrukere } from '../../felles-komponenter/utils/logging';
import { useErVeileder } from '../../Provider';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/AktiverDigitalOppfolging';
import HarIkkeAktivitetsplan from './HarIkkeAktivitetsplan';
import { useSelector } from 'react-redux';
import { MinimalPeriode, selectOppfolgingStatus } from './oppfolging-selector';
import { Status } from '../../createGenericSlice';

interface VidereSendBrukereEllerRenderChildrenProps {
    children: React.ReactNode;
    erVeileder: boolean;
    manuell: boolean | undefined;
    underOppfolging: boolean;
    reservasjonKRR: boolean | undefined;
    oppfolgingsPerioder: MinimalPeriode[];
    servicegruppe: string | undefined;
    ident: string;
    aktorId: string | undefined;
}

const VidereSendBrukereEllerRenderChildren = (props: VidereSendBrukereEllerRenderChildrenProps) => {
    const { servicegruppe, underOppfolging, ident, aktorId, children, manuell, oppfolgingsPerioder, reservasjonKRR } =
        props;

    const oppfolgingsStatus = useSelector(selectOppfolgingStatus);
    const erVeileder = useErVeileder();
    const ikkeDigitalOppfolging = reservasjonKRR || manuell;

    useEffect(() => {
        if (erVeileder && servicegruppe) {
            loggAntalVeiledere(servicegruppe, underOppfolging, ident, aktorId);
        } else if (servicegruppe && aktorId) {
            loggingAntallBrukere(servicegruppe, underOppfolging, aktorId);
        }
    }, [ident, aktorId, servicegruppe, underOppfolging, erVeileder]);

    if (oppfolgingsStatus === Status.OK && !underOppfolging && oppfolgingsPerioder.length === 0) {
        return <HarIkkeAktivitetsplan erVeileder={erVeileder} />;
    }

    if (!erVeileder && ikkeDigitalOppfolging) {
        return <AktiverDigitalOppfolging />;
    }

    return <>{children}</>;
};

export default VidereSendBrukereEllerRenderChildren;
