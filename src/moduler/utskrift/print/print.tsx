import { Sidetittel } from 'nav-frontend-typografi';
import React from 'react';

import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../datatypes/dialogTypes';
import { KvpPeriode, Mal } from '../../../datatypes/oppfolgingTypes';
import { Bruker } from '../../../datatypes/types';
import { div as HiddenIfDiv, section as HiddenIfSection } from '../../../felles-komponenter/hidden-if/hidden-if';
import StoreForbokstaver from '../../../felles-komponenter/utils/StoreForbokstaver';
import { formaterDatoKortManed } from '../../../utils';
import logoPng from '../ikoner/logo.png';
import Adresse from './adresse';
import Aktiviteter from './aktiviteter/Aktiviteter';
import { DialogerUtenAktivitet } from './dialoger';
import { filtrerAktiviteter, filtrerDialoger } from './filter-utils';
import MalPrint from './malPrint';

interface Props {
    dialoger?: Dialog[];
    bruker: Bruker;
    printMelding?: string;
    aktiviteter?: Aktivitet[];
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

    return (
        <div className="printmodal-body" hidden={hidden}>
            <img className="printmodal-body__nav-logo-print" src={logoPng} alt="Logo NAV" />
            <div className="printmodal-body__adresse-dato">
                <div className="printmodal-body__adresse">
                    <HiddenIfDiv hidden={!erVeileder}>
                        <StoreForbokstaver>{`${fornavn} ${etternavn}`}</StoreForbokstaver>
                        <Adresse bruker={bruker} />
                    </HiddenIfDiv>
                </div>
                <div className="printmodal-body__dato">
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
            <Sidetittel tag="h1" className="printmodal-body__utskrift--overskrift">
                Aktivitetsplan
            </Sidetittel>
            <HiddenIfSection hidden={printMelding === ''} className="printmodal-body__visprintmelding">
                <p>{printMelding}</p>
            </HiddenIfSection>
            <MalPrint mittMal={mittMal} />
            <Aktiviteter aktiviteter={filtrerteAktiviteter} dialoger={filtrerteDialoger} />
            <DialogerUtenAktivitet dialoger={filtrerteDialoger} />
        </div>
    );
}

export default Print;
