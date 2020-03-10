import React, { useEffect } from 'react';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/aktiver-digital-oppfolging';
import HarIkkeAktivitetsplan from './har-ikke-aktivitetsplan';
import { loggAntalVeiledere, loggingAntallBrukere } from '../../felles-komponenter/utils/logging';
import { useHarNyDialog } from '../../felles-komponenter/feature/feature';

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

const dialogRegex = /\/dialog(\/.*)?(\?.*)?$/g;

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
    const pathname = window.location.pathname;
    const skalRedirectes = !erVeileder && dialogRegex.test(pathname);

    const harNyDialog = useHarNyDialog();
    useEffect(() => {
        if (erVeileder === undefined || erVeileder === null || skalRedirectes) {
            return;
        }

        if (erVeileder) {
            loggAntalVeiledere(servicegruppe, underOppfolging, ident, aktorId);
        } else {
            loggingAntallBrukere(servicegruppe, underOppfolging, aktorId, harNyDialog);
        }
    }, [ident, aktorId, servicegruppe, underOppfolging, erVeileder, harNyDialog, skalRedirectes]);

    if (!underOppfolging && oppfolgingsPerioder.length === 0) {
        return <HarIkkeAktivitetsplan erVeileder={erVeileder} />;
    }

    if (!erVeileder && ikkeDigitalOppfolging) {
        return <AktiverDigitalOppfolging />;
    }

    return <div>{children}</div>;
}

export default VidereSendBrukereEllerRenderChildren;
