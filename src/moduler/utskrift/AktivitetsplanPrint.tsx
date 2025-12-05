import { Loader, Modal } from '@navikt/ds-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { defer, LoaderFunctionArgs, useNavigate, useParams } from 'react-router-dom';

import { hentAdresse, hentPerson } from '../../api/personAPI';
import { Bruker, Postadresse } from '../../datatypes/types';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import loggEvent, { PRINT_MODAL_OPEN } from '../../felles-komponenter/utils/logging';
import { useErVeileder, useFnrOgEnhetContext } from '../../Provider';
import { selectAktivitetListe, selectAktivitetListeStatus } from '../aktivitet/aktivitetlisteSelector';
import { selectDialoger, selectDialogStatus } from '../dialog/dialog-selector';
import { selectGjeldendeMal, selectMalStatus } from '../mal/aktivitetsmal-selector';
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
import { hentPdfTilForhaandsvisning, selectPdf } from '../verktoylinje/arkivering/arkiv-slice';
import { createBlob, PdfViewer } from '../journalforing/PdfViewer';
import { selectFilterSlice } from '../filtrering/filter/filter-selector';
import {
    defaultFilter, lagKvpUtvalgskriterie,
    mapTilJournalforingFilter
} from '../journalforing/journalforingFilter';

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
    const aktiviteter = useSelector(selectAktivitetListe);
    const kvpPerioder = useSelector(selectKvpPeriodeForValgteOppfolging);
    const dialoger = useSelector(selectDialoger);
    const mittMal = useSelector(selectGjeldendeMal);
    const erManuell = useSelector(selectErBrukerManuell);
    const { hovedsideRoute } = useRoutes();
    const filterState = useSelector(selectFilterSlice);
    const { oppfolgingsperiodeId } = useParams<{ oppfolgingsperiodeId: string }>();
    const pdf = useSelector(selectPdf);

    if (!oppfolgingsperiodeId) {
        throw new Error('Kan ikke hente forhåndsvisning når aktiv enhet ikke er valgt');
    }

    const avhengigheter = [
        useSelector(selectMalStatus),
        useSelector(selectOppfolgingStatus),
        useSelector(selectAktivitetListeStatus),
        useSelector(selectDialogStatus)
    ];

    const dispatch = useAppDispatch();

    const erVeileder = useErVeileder();
    useEffect(() => {
        dispatch(hentMal());
        dispatch(hentMalListe());
        loggEvent(PRINT_MODAL_OPEN);
    }, []);

    const { fnr } = useFnrOgEnhetContext();
    const [adresse, setAdresse] = useState<null | Postadresse>(null);
    const [bruker, setBruker] = useState<Bruker>({});

    const [isLoadingAdresse, setIsLoadingAdresse] = useState(true);
    const [isLoadingBruker, setIsLoadingBruker] = useState(true);

    const blob = useMemo(() => {
        if (!pdf) return undefined;
        return createBlob(pdf);
    }, [pdf]);


    useEffect(() => {
        if (fnr) {
            hentPerson(fnr)
                .then((bruker) => setBruker(bruker))
                .finally(() => setIsLoadingBruker(false));
            hentAdresse(fnr)
                .then((a) => setAdresse(a?.adresse))
                .finally(() => setIsLoadingAdresse(false));
        }
    }, [fnr]);

    const [stepIndex, setStepIndex] = useState(0);
    const [printMelding, setPrintMelding] = useState('');
    const [utskriftform, setUtskriftform] = useState('aktivitetsplan');

    const next = () => setStepIndex(stepIndex + 1);

    const printMeldingSubmit = (formValues: PrintFormValues) => {
        setPrintMelding(formValues.beskrivelse);
        next();
        return Promise.resolve();
    };

    const velgPlanSubmit = (formValues: VelgPlanUtskriftFormValues) => {
        setUtskriftform(formValues.utskritPlanType);
        if(formValues.utskritPlanType !== utskriftform) {
            oppdaterForhaandsvistPdf(formValues.utskritPlanType)
        }
        next();
        return Promise.resolve();
    };

    const kanHaPrintValg = kvpPerioder && kvpPerioder.length > 0 && erVeileder;
    const kanHaPrintMelding = erManuell && erVeileder;

    const steps = getSteps(kanHaPrintValg, kanHaPrintMelding);
    const navigate = useNavigate();

    const goBack = () => navigate(-1);
    if (fnr && (isLoadingAdresse || isLoadingBruker)) {
        return <Loader />;
    }

    const oppdaterForhaandsvistPdf = (nyUtskriftsform: string) => {
        const kvpUtvalgskriterie = lagKvpUtvalgskriterie(nyUtskriftsform, kvpPerioder);
        dispatch(
            hentPdfTilForhaandsvisning({
                oppfolgingsperiodeId,
                filter: mapTilJournalforingFilter(filterState, false, kvpUtvalgskriterie)
            })
        );
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
        const nyFane = window.open(blob, '_blank')
        if(nyFane) {
         nyFane.onload = () => {
             nyFane.focus()
             nyFane.print()
         };
        }
    };

    return (
        <section className="flex flex-col justify-center items-center p-8">
            <div className="aktivitetsplanprint flex justify-center items-center">
                {prompt}
                <PrintVerktoylinje
                    tilbakeRoute={hovedsideRoute()}
                    kanSkriveUt={steps[stepIndex] === STEP_UTSKRIFT}
                    oppdaterForhaandsvistPdf={() => oppdaterForhaandsvistPdf(utskriftform)}
                    skrivUt={skrivUt}
                />
                <div className="border print:border-none">
                    {/*<div className="h-full grow bg-bg-subtle max-h-100vh overflow-x-scroll overflow-y-hidden pb-4">*/}
                    <PdfViewer pdf={blob} />
                    {/*</div>*/}
                </div>
            </div>
        </section>
    );
};

export const aktivitetsplanPrintLoader =
    (dispatch: Dispatch, aktivEnhet: string) =>
        ({
             params: { oppfolgingsperiodeId }
         }: LoaderFunctionArgs<{
            oppfolgingsperiodeId: string;
        }>) => {
            if (!oppfolgingsperiodeId) {
                throw Error('path param is not set, this should never happen');
            }
            const forhaandsvisning = dispatch(
                hentPdfTilForhaandsvisning({
                    oppfolgingsperiodeId,
                    filter: defaultFilter
                })
            );
            return defer({
                forhaandsvisning
            });
        };

export default AktivitetsplanPrint;
