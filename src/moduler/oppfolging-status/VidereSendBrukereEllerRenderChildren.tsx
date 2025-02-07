import React, { useEffect } from 'react';

import { loggAntalVeiledere, loggingAntallBrukere } from '../../felles-komponenter/utils/logging';
import { useErVeileder } from '../../Provider';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/AktiverDigitalOppfolging';
import HarIkkeAktivitetsplan from './HarIkkeAktivitetsplan';
import { useSelector } from 'react-redux';
import {
    selectAktorId,
    selectErBrukerManuell,
    selectErRegisrertIKRR,
    selectErUnderOppfolging,
    selectOppfolgingsPerioder,
    selectOppfolgingStatus,
    selectReservasjonKRR,
    selectServicegruppe,
} from './oppfolging-selector';
import { Status } from '../../createGenericSlice';
import { selectAktivitetStatus } from '../aktivitet/aktivitet-selector';
import { selectIdentitetId } from '../identitet/identitet-selector';
import { IkkeRegistrertIKRRAdvarsel } from './IkkeRegistrertIKRRAdvarsel';

interface VidereSendBrukereEllerRenderChildrenProps {
    children: React.ReactNode;
}

const VidereSendBrukereEllerRenderChildren = (props: VidereSendBrukereEllerRenderChildrenProps) => {
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const oppfolgingsPerioder = useSelector(selectOppfolgingsPerioder);
    const manuell = useSelector(selectErBrukerManuell);
    const reservasjonKRR = useSelector(selectReservasjonKRR);
    const erRegistrertIKRR = useSelector(selectErRegisrertIKRR);
    const servicegruppe = useSelector(selectServicegruppe);
    const aktorId = useSelector(selectAktorId);
    const ident = useSelector(selectIdentitetId);

    const oppfolgingsStatus = useSelector(selectOppfolgingStatus);
    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const erVeileder = useErVeileder();
    const ikkeDigitalOppfolging = reservasjonKRR || manuell;

    useEffect(() => {
        if (erVeileder && servicegruppe) {
            loggAntalVeiledere(servicegruppe, underOppfolging, ident, aktorId);
        } else if (servicegruppe && aktorId) {
            loggingAntallBrukere(servicegruppe, underOppfolging, aktorId);
        }
    }, [ident, aktorId, servicegruppe, underOppfolging, erVeileder]);

    if (
        oppfolgingsStatus === Status.OK &&
        aktivitetStatus === Status.OK &&
        !underOppfolging &&
        oppfolgingsPerioder.length === 0
    ) {
        return <HarIkkeAktivitetsplan erVeileder={erVeileder} />;
    }

    if (!erVeileder && !erRegistrertIKRR && oppfolgingsStatus === Status.OK) {
        return (
            <>
                <IkkeRegistrertIKRRAdvarsel erRegistrertIKRR={erRegistrertIKRR} erVeileder={erVeileder} />
            </>
        );
    }
    if ( !erVeileder && ikkeDigitalOppfolging) {
        return (
            <>
                <AktiverDigitalOppfolging />
            </>
        );
    }

    return <>{props.children}</>;
};


export default VidereSendBrukereEllerRenderChildren;
