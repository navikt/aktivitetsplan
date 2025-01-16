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
import { Alert, Heading, Link } from '@navikt/ds-react';

interface VidereSendBrukereEllerRenderChildrenProps {
    children: React.ReactNode;
}


function KRRAdvarsel({ erRegistrertIKRR, erVeilder}: { erRegistrertIKRR: boolean; erVeilder: boolean; }) {
     if (!erRegistrertIKRR && !erVeilder) {

        return (
            <div className="flex items-center flex-col">
                <Alert variant="warning" className="mx-2 mb-5 max-w-2xl">
                    <Heading spacing size="small" level="3">
                        Vi har ikke din kontaktinformasjon;
                    </Heading>
                    <p>
                        Du kan ikke bruke aktivitetsplanen fordi du ikke har registrert e-post eller telefonnummeret
                        ditt i kontakt og reservasjonsregisteret (KRR).
                    </p>
                    <Link href={'https://www.norge.no/nb/digital-borgar/registrere'}>
                        Gå til norge.no for å registrere.
                    </Link>
                </Alert>
            </div>
        );

    } else if (erVeilder && !erRegistrertIKRR){
        return(
        <div className="flex items-center flex-col">
            <Alert variant="warning" className="mx-2 mb-5 max-w-2xl">
                <Heading spacing size="small" level="3">
                    Brukeren er ikke registrert i KRR
                </Heading>
                <p>
                    Du kan ikke bruke aktivitetsplanen fordi brukeren ikke
                    har registrert e-post eller telefonnummeret sitt i KRR
                </p>
                <Link href={'https://www.norge.no/nb/digital-borgar/registrere'}>
                    Brukeren må gå til norge.no for å registrere.
                </Link>
            </Alert>
        </div>
        )
    }
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

    if (!erRegistrertIKRR && oppfolgingsStatus === Status.OK) {
        return <KRRAdvarsel erRegistrertIKRR={erRegistrertIKRR} erVeilder={erVeileder}/>;

    }
    if (ikkeDigitalOppfolging) {
        return <AktiverDigitalOppfolging />;
    }

     return <>{props.children}</>;
};

export default VidereSendBrukereEllerRenderChildren;
