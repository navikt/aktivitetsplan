import { Heading } from '@navikt/ds-react';
import React from 'react';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../datatypes/dialogTypes';
import { KvpPeriode, Mal } from '../../../datatypes/oppfolgingTypes';
import { Bruker, Postadresse } from '../../../datatypes/types';
import { div as HiddenIfDiv, section as HiddenIfSection } from '../../../felles-komponenter/hidden-if/hidden-if';
import StoreForbokstaver from '../../../felles-komponenter/utils/StoreForbokstaver';
import { formaterDatoKortManed } from '../../../utils/dateUtils';
import logoPngImagePath from '../ikoner/logo.png';
import Adresse from './adresse';
import Aktiviteter from './aktiviteter/Aktiviteter';
import { DialogerUtenAktivitet } from './dialoger';
import { filtrerAktiviteter, filtrerDialoger } from './filter-utils';
import MalPrint from './malPrint';

interface Props {
    dialoger?: Dialog[];
    bruker: Bruker;
    adresse: Postadresse | null;
    printMelding?: string;
    aktiviteter?: AlleAktiviteter[];
    mittMal?: Mal;
    erVeileder?: boolean;
    utskriftPlanType?: string;
    kvpPerioder?: KvpPeriode[];
    hidden?: boolean;
}

function Print(props: Props) {
    const {
        aktiviteter,
        bruker,
        adresse,
        printMelding,
        mittMal,
        erVeileder,
        dialoger,
        utskriftPlanType,
        kvpPerioder,
        hidden,
    } = props;

    const { fodselsnummer, fornavn, etternavn, geografiskEnhet } = bruker;
    const enhetsNavn = geografiskEnhet && geografiskEnhet.navn;

    const erKvpUtskrift =
        utskriftPlanType !== undefined && utskriftPlanType !== 'helePlanen' && utskriftPlanType !== 'aktivitetsplan';

    const valgtKvpPeriode = kvpPerioder && kvpPerioder.find((periode) => periode.opprettetDato === utskriftPlanType);

    const filtrerteAktiviteter = filtrerAktiviteter(utskriftPlanType, kvpPerioder, valgtKvpPeriode, aktiviteter);

    const filtrerteDialoger = filtrerDialoger(utskriftPlanType, kvpPerioder, valgtKvpPeriode, dialoger);

    const kvpPeriodeFra = valgtKvpPeriode ? formaterDatoKortManed(valgtKvpPeriode.opprettetDato) : undefined;
    const kvpPeriodeTil = valgtKvpPeriode ? formaterDatoKortManed(valgtKvpPeriode.avsluttetDato) : undefined;

    const navLogoPng = new URL(logoPngImagePath, import.meta.url).href;

    return (
        <div id="printarea" className="printmodal-body w-[670px]" hidden={hidden}>
            <img className="my-8" src={navLogoPng} alt="Logo Nav" />
            <div className="flex justify-between mb-8">
                <div className="">
                    <HiddenIfDiv hidden={!erVeileder}>
                        <StoreForbokstaver>{`${fornavn} ${etternavn}`}</StoreForbokstaver>
                        {adresse && <Adresse adresse={adresse} />}
                    </HiddenIfDiv>
                </div>
                <div>
                    <HiddenIfDiv hidden={!erVeileder}>{enhetsNavn}</HiddenIfDiv>
                    Dato: {formaterDatoKortManed(Date.now())}
                    <HiddenIfDiv hidden={!fodselsnummer}>
                        Fødselsnummer:
                        {` ${fodselsnummer}`}
                    </HiddenIfDiv>
                    <HiddenIfDiv hidden={!erKvpUtskrift}>Modia Arbeidsrettet Oppfølging</HiddenIfDiv>
                    <HiddenIfDiv hidden={!erKvpUtskrift}>
                        Periode: {kvpPeriodeFra} - {kvpPeriodeTil}
                    </HiddenIfDiv>
                </div>
            </div>
            <Heading level="1" size="xlarge">
                Aktivitetsplan
            </Heading>
            <HiddenIfSection hidden={printMelding === ''}>
                <p>{printMelding}</p>
            </HiddenIfSection>
            <MalPrint mittMal={mittMal} />
            <Aktiviteter aktiviteter={filtrerteAktiviteter} dialoger={filtrerteDialoger} />
            <DialogerUtenAktivitet dialoger={filtrerteDialoger} />
        </div>
    );
}

export default Print;
