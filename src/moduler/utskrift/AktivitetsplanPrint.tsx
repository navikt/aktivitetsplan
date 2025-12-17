import { Loader, Modal } from '@navikt/ds-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { defer, LoaderFunctionArgs, useNavigate, useParams } from 'react-router-dom';

import { hentPerson } from '../../api/personAPI';
import { Bruker } from '../../datatypes/types';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import loggEvent, { PRINT_MODAL_OPEN } from '../../felles-komponenter/utils/logging';
import { useErVeileder, useFnrOgEnhetContext } from '../../Provider';
import { selectAktivitetListeStatus } from '../aktivitet/aktivitetlisteSelector';
import { selectDialogStatus } from '../dialog/dialog-selector';
import { selectMalStatus } from '../mal/aktivitetsmal-selector';
import { hentMal } from '../mal/aktivitetsmal-slice';
import { hentMalListe } from '../mal/malliste-slice';
import {
    selectErBrukerManuell,
    selectKvpPeriodeForValgteOppfolging,
    selectOppfolgingStatus
} from '../oppfolging-status/oppfolging-selector';
import PrintVerktoylinje from './printVerktoylinje';
import PrintMeldingForm, { PrintFormValues } from './PrintMeldingForm';
import VelgPlanUtskriftForm, { VelgPlanUtskriftFormValues } from './velgPlan/VelgPlanUtskriftForm';
import { useRoutes } from '../../routing/useRoutes';
import { Dispatch } from '../../store';
import {
    hentPdfTilForhaandsvisningSendTilBruker,
    journalforOgSendTilBruker,
    selectForhaandsvisningSendTilBrukerOpprettet,
    selectForhaandsvisningSendTilBrukerStatus,
    selectPdfForhaandsvisningSendTilBruker,
    selectSendTilBrukerStatus
} from '../verktoylinje/arkivering/arkiv-slice';
import { createBlob, PdfViewer } from '../journalforing/PdfViewer';
import { selectFilterSlice } from '../filtrering/filter/filter-selector';
import {
    defaultFilter,
    KvpUtvalgskriterie,
    KvpUtvalgskriterieAlternativ,
    lagKvpUtvalgskriterie,
    mapTilJournalforingFilter
} from '../journalforing/journalforingFilter';
import { Status } from '../../createGenericSlice';
import { StatusErrorBoundry } from '../journalforing/StatusErrorBoundry';
import { filterErAktivt, filtreErLike } from '../filtrering/filter/filter-utils';

const STEP_VELG_PLAN = 'VELG_PLAN';
const STEP_MELDING_FORM = 'MELDING_FORM';
const STEP_UTSKRIFT = 'UTSKRIFT';

function getSteps(kanHaPrintValg?: boolean, kanHaPrintMelding?: boolean): string[] {
    const steps = [];

    if (kanHaPrintValg) {
        steps.push(STEP_VELG_PLAN);
    }

    if (kanHaPrintMelding) {
        steps.push(STEP_MELDING_FORM);
    }

    steps.push(STEP_UTSKRIFT);
    return steps;
}

const AktivitetsplanPrint = () => {
    const kvpPerioder = useSelector(selectKvpPeriodeForValgteOppfolging);
    const erManuell = useSelector(selectErBrukerManuell);
    const { hovedsideRoute } = useRoutes();
    const filterState = useSelector(selectFilterSlice);
    const { oppfolgingsperiodeId } = useParams<{ oppfolgingsperiodeId: string }>();
    const pdf = useSelector(selectPdfForhaandsvisningSendTilBruker);
    const { aktivEnhet: journalførendeEnhetId } = useFnrOgEnhetContext();
    const forhaandsvisningOpprettet = useSelector(selectForhaandsvisningSendTilBrukerOpprettet);
    const sendTilBrukerStatus = useSelector(selectSendTilBrukerStatus);
    const forhaandsvisningStatus = useSelector(selectForhaandsvisningSendTilBrukerStatus);
    const [isLoadingBruker, setIsLoadingBruker] = useState(true);
    const [stepIndex, setStepIndex] = useState(0);
    const [printMelding, setPrintMelding] = useState('');
    const [utskriftform, setUtskriftform] = useState('aktivitetsplan');
    const [pdfMåOppdateresEtterFilterendring, setPdfMåOppdateresEtterFilterendring] = useState(false);
    const [filterBruktTilForhaandsvisning, setFilterBruktTilForhaandsvisning] = useState(filterState);

    if (!oppfolgingsperiodeId) {
        throw new Error('Kan ikke hente forhåndsvisning når aktiv enhet ikke er valgt');
    }

    const avhengigheter = [
        useSelector(selectMalStatus),
        useSelector(selectOppfolgingStatus),
        useSelector(selectAktivitetListeStatus),
        useSelector(selectDialogStatus),
    ];

    const dispatch = useAppDispatch();

    const erVeileder = useErVeileder();
    useEffect(() => {
        dispatch(hentMal());
        dispatch(hentMalListe());
        loggEvent(PRINT_MODAL_OPEN);
    }, []);

    const { fnr } = useFnrOgEnhetContext();
    const [bruker, setBruker] = useState<Bruker>({});
    const [kvpUtvalgskriterie, setKvpUtvalgskriterie] = useState<KvpUtvalgskriterie>({
        alternativ: erVeileder
            ? KvpUtvalgskriterieAlternativ.EKSKLUDER_KVP_AKTIVITETER
            : KvpUtvalgskriterieAlternativ.INKLUDER_KVP_AKTIVITETER,
    });

    const blob = useMemo(() => {
        if (!pdf) return undefined;
        return createBlob(pdf);
    }, [pdf]);

    useEffect(() => {
        if (fnr) {
            hentPerson(fnr)
                .then((bruker) => setBruker(bruker))
                .finally(() => setIsLoadingBruker(false));
        }
    }, [fnr]);

    useEffect(() => {
        const filterBrukt = filterErAktivt(filterState);
        const filterEndretSidenForhaandsvisning = !filtreErLike(filterBruktTilForhaandsvisning, filterState);
        setPdfMåOppdateresEtterFilterendring(filterBrukt || filterEndretSidenForhaandsvisning);
    }, [filterState]);

    const next = () => setStepIndex(stepIndex + 1);

    const printMeldingSubmit = (formValues: PrintFormValues) => {
        setPrintMelding(formValues.beskrivelse);
        next();
        return Promise.resolve().then(() => oppdaterForhaandsvistPdf(kvpUtvalgskriterie, formValues.beskrivelse));
    };

    const velgPlanSubmit = (formValues: VelgPlanUtskriftFormValues) => {
        setUtskriftform(formValues.utskritPlanType);
        if (formValues.utskritPlanType !== utskriftform) {
            const nyKvpUtvalgskriterie = lagKvpUtvalgskriterie(formValues.utskritPlanType, kvpPerioder);
            setKvpUtvalgskriterie(nyKvpUtvalgskriterie);
            oppdaterForhaandsvistPdf(nyKvpUtvalgskriterie);
        }
        next();
        return Promise.resolve();
    };

    const kanHaPrintValg = kvpPerioder && kvpPerioder.length > 0 && erVeileder;
    const kanHaPrintMelding = erManuell && erVeileder;

    const steps = getSteps(kanHaPrintValg, kanHaPrintMelding);
    const navigate = useNavigate();

    const goBack = () => navigate(-1);
    if (fnr && isLoadingBruker) {
        return <Loader />;
    }

    const oppdaterForhaandsvistPdf = (nyKvpUtvalgskriterie?: KvpUtvalgskriterie, nyPrintMelding?: string) => {
        dispatch(
            hentPdfTilForhaandsvisningSendTilBruker({
                oppfolgingsperiodeId,
                filter: mapTilJournalforingFilter(
                    filterState,
                    false,
                    nyKvpUtvalgskriterie ? nyKvpUtvalgskriterie : kvpUtvalgskriterie,
                ),
                journalførendeEnhetId: journalførendeEnhetId ? journalførendeEnhetId : "",
                tekstTilBruker: nyPrintMelding ? nyPrintMelding : printMelding,
            }),
        );
        setFilterBruktTilForhaandsvisning(filterState);
        setPdfMåOppdateresEtterFilterendring(false);
    };

    const getPrompt = () => {
        if (steps[stepIndex] === STEP_MELDING_FORM) {
            return (
                <Modal
                    closeOnBackdropClick
                    onClose={goBack}
                    open
                    header={{ heading: `Aktivitetsplan for ${bruker.fornavn}`, closeButton: true }}
                >
                    <Innholdslaster avhengigheter={avhengigheter}>
                        <PrintMeldingForm bruker={bruker} onSubmit={printMeldingSubmit} />
                    </Innholdslaster>
                </Modal>
            );
        }
        if (steps[stepIndex] === STEP_VELG_PLAN) {
            return (
                <Modal onClose={goBack} open header={{ heading: 'Velg hva du ønsker å skrive ut', closeButton: true }}>
                    <Modal.Body>
                        <Innholdslaster avhengigheter={avhengigheter}>
                            <VelgPlanUtskriftForm kvpPerioder={kvpPerioder} onSubmit={velgPlanSubmit} />
                        </Innholdslaster>
                    </Modal.Body>
                </Modal>
            );
        }
    };
    const prompt = getPrompt();

    const skrivUt = () => {
        const nyFane = window.open(blob, '_blank');
        if (nyFane) {
            nyFane.onload = () => {
                nyFane.focus();
                nyFane.print();
            };
        }
    };

    const sendTilBruker = () => {
        const kvpUtvalgskriterie = lagKvpUtvalgskriterie(utskriftform, kvpPerioder);
        if (forhaandsvisningOpprettet && journalførendeEnhetId) {
            dispatch(
                journalforOgSendTilBruker({
                    forhaandsvisningOpprettet,
                    journalførendeEnhetId,
                    oppfolgingsperiodeId,
                    filter: mapTilJournalforingFilter(filterState, false, kvpUtvalgskriterie),
                    tekstTilBruker: printMelding,
                }),
            );
        }
    };

    const kanSendeTilBruker: boolean = erVeileder && utskriftform === 'aktivitetsplan';

    return (
        <section className="flex flex-col justify-center items-center p-8">
            <div className="aktivitetsplanprint flex justify-center items-center">
                {prompt}
                <PrintVerktoylinje
                    tilbakeRoute={hovedsideRoute()}
                    kanSkriveUt={steps[stepIndex] === STEP_UTSKRIFT}
                    oppdaterForhaandsvistPdf={() => oppdaterForhaandsvistPdf(kvpUtvalgskriterie, printMelding)}
                    skrivUt={skrivUt}
                    kanSendeTilBruker={kanSendeTilBruker}
                    sendTilBruker={sendTilBruker}
                    pdfMåOppdateresEtterFilterendring={pdfMåOppdateresEtterFilterendring}
                />
                <StatusErrorBoundry
                    statuser={[sendTilBrukerStatus]}
                    errorMessage="Kunne ikke sende aktivitetsplan til bruker"
                >
                    <div className="bg-bg-subtle print:border-none">
                        <PdfViewer
                            pdf={blob}
                            suksessmelding={'Aktivitetsplanen ble sendt til bruker'}
                            visSuksessmelding={sendTilBrukerStatus === Status.OK}
                            forhaandsvisningStatus={forhaandsvisningStatus}
                            blur={pdfMåOppdateresEtterFilterendring}
                        />
                    </div>
                </StatusErrorBoundry>
            </div>
        </section>
    );
};

export const aktivitetsplanPrintLoader =
    (dispatch: Dispatch, erVeileder: boolean, aktivEnhet: string) =>
    ({
        params: { oppfolgingsperiodeId },
    }: LoaderFunctionArgs<{
        oppfolgingsperiodeId: string;
        aktivEnhet: string;
    }>) => {
        if (!oppfolgingsperiodeId) {
            throw Error('path param is not set, this should never happen');
        }
        const forhaandsvisning = dispatch(
            hentPdfTilForhaandsvisningSendTilBruker({
                oppfolgingsperiodeId,
                filter: defaultFilter(erVeileder),
                journalførendeEnhetId: aktivEnhet ? aktivEnhet : "",
                tekstTilBruker: '',
            }),
        );
        return defer({
            forhaandsvisning,
        });
    };

export default AktivitetsplanPrint;
