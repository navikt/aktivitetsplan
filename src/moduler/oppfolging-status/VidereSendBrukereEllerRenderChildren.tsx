import React from 'react';

import { useErVeileder } from '../../Provider';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/AktiverDigitalOppfolging';
import HarIkkeAktivitetsplan from './HarIkkeAktivitetsplan';
import { useSelector } from 'react-redux';
import {
    selectErBrukerManuell,
    selectErRegisrertIKRR,
    selectErUnderOppfolging,
    selectKanVarsles,
    selectOppfolgingsPerioder,
    selectOppfolgingStatus,
    selectReservasjonKRR,
} from './oppfolging-selector';
import { Status } from '../../createGenericSlice';
import { selectAktivitetStatus } from '../aktivitet/aktivitet-selector';
import { IkkeRegistrertIKRRAdvarsel } from './IkkeRegistrertIKRRAdvarsel';
import { UtdatertKontaktinformasjonAdvarsel } from './UtdatertKontaktinformasjonAdvarsel';

interface VidereSendBrukereEllerRenderChildrenProps {
    children: React.ReactNode;
}

const VidereSendBrukereEllerRenderChildren = (props: VidereSendBrukereEllerRenderChildrenProps) => {
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const oppfolgingsPerioder = useSelector(selectOppfolgingsPerioder);
    const manuell = useSelector(selectErBrukerManuell);
    const reservasjonKRR = useSelector(selectReservasjonKRR);
    const erRegistrertIKRR = useSelector(selectErRegisrertIKRR); //|| throw new Error("LOL");
    const kanVarsles = useSelector(selectKanVarsles);

    const oppfolgingsStatus = useSelector(selectOppfolgingStatus);
    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const erVeileder = useErVeileder();
    const ikkeDigitalOppfolging = reservasjonKRR || manuell;
    const utdatertIKRR = !kanVarsles && erRegistrertIKRR;

    if (
        oppfolgingsStatus === Status.OK &&
        aktivitetStatus === Status.OK &&
        !underOppfolging &&
        oppfolgingsPerioder.length === 0
    ) {
        return <HarIkkeAktivitetsplan erVeileder={erVeileder} />;
    }

    if (ikkeDigitalOppfolging) {
        return (
            <>
                <AktiverDigitalOppfolging />
                {props.children}
            </>
        );
    }

    if (!erRegistrertIKRR && oppfolgingsStatus === Status.OK) {
        return (
            <>
                <IkkeRegistrertIKRRAdvarsel erRegistrertIKRR={erRegistrertIKRR} erVeileder={erVeileder} />
                {props.children}
            </>
        );
    }

    if (utdatertIKRR && oppfolgingsStatus === Status.OK) {
        return (
            <>
                <UtdatertKontaktinformasjonAdvarsel utdatertIKRR={utdatertIKRR} erVeileder={erVeileder} />
                {props.children}
            </>
        );
    }

    return <>{props.children}</>;
};

export default VidereSendBrukereEllerRenderChildren;
