import React, { useEffect } from 'react';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/aktiver-digital-oppfolging';
import HarIkkeAktivitetsplan from './har-ikke-aktivitetsplan';
import { loggAntalVeiledere, loggingAntallBrukere } from '../../felles-komponenter/utils/logging';

interface VidereSendBrukereEllerRenderChildrenProps {
    children: React.ReactNode;
    erVeileder: boolean;
    manuell: boolean;
    underOppfolging: boolean;
    reservasjonKRR: boolean;
    videreSendTilInfo: boolean;
    kanStarteOppfolging: boolean;
    oppfolgingsPerioder: Array<any>;
    servicegruppe: string;
    ident: string;
    aktorId: string;
}

function VidereSendBrukereEllerRenderChildren(props: VidereSendBrukereEllerRenderChildrenProps) {
    const {
        erVeileder,
        servicegruppe,
        underOppfolging,
        ident,
        aktorId,
        children,
        manuell,
        oppfolgingsPerioder,
        reservasjonKRR
    } = props;

    const ikkeDigitalOppfolging = reservasjonKRR || manuell;

    useEffect(() => {
        if (erVeileder === undefined || erVeileder === null) {
            return;
        }

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

    return <div>{children}</div>;
}

export default VidereSendBrukereEllerRenderChildren;
