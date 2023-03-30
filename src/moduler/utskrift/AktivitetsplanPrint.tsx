import { Loader, Modal } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { hentAdresse, hentPerson } from '../../api/personAPI';
import { AlleAktiviteter } from '../../datatypes/aktivitetTypes';
import { Dialog } from '../../datatypes/dialogTypes';
import { KvpPeriode, Mal } from '../../datatypes/oppfolgingTypes';
import { Bruker, Postadresse } from '../../datatypes/types';
import Innholdslaster, { InnholdslasterProps } from '../../felles-komponenter/utils/Innholdslaster';
import loggEvent, { PRINT_MODSAL_OPEN } from '../../felles-komponenter/utils/logging';
import { useErVeileder } from '../../Provider';
import { hentFnrFraUrl } from '../../utils/fnr-util';
import { selectAktivitetListe, selectAktivitetListeStatus } from '../aktivitet/aktivitetlisteSelector';
import { selectDialogStatus, selectDialoger } from '../dialog/dialog-selector';
import { hentMal, selectGjeldendeMal, selectMalStatus } from '../mal/aktivitetsmal-reducer';
import { hentMalListe } from '../mal/malliste-reducer';
import {
    selectErBrukerManuell,
    selectKvpPeriodeForValgteOppfolging,
    selectOppfolgingStatus,
} from '../oppfolging-status/oppfolging-selector';
import ModalHeader from './modalHeader';
import Print from './print/print';
import PrintMeldingForm, { PrintFormValues } from './PrintMeldingForm';
import VelgPlanUtskriftForm, { VelgPlanUtskriftFormValues } from './velgPlan/VelgPlanUtskriftForm';

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

interface Props {
    doHentMal: () => void;
    doHentMalListe: () => void;
    avhengigheter: InnholdslasterProps['avhengigheter'];
    bruker: Bruker;
    kvpPerioder?: KvpPeriode[];
    dialoger?: Dialog[];
    mittMal?: Mal;
    aktiviteter?: AlleAktiviteter[];
    erManuell?: boolean;
}

const AktivitetsplanPrint = (props: Props) => {
    const { doHentMal, doHentMalListe, avhengigheter, kvpPerioder, dialoger, mittMal, aktiviteter, erManuell } = props;
    const erVeileder = useErVeileder();
    useEffect(() => {
        doHentMal();
        doHentMalListe();
        loggEvent(PRINT_MODSAL_OPEN);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fnr = hentFnrFraUrl();
    const [adresse, setAdresse] = useState<null | Postadresse>(null);
    const [bruker, setBruker] = useState<Bruker>({});

    const [isLoadingAdresse, setIsLoadingAdresse] = useState(true);
    const [isLoadingBruker, setIsLoadingBruker] = useState(true);

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
    const [utskriftform, setUtskriftform] = useState('helePlanen');

    const next = () => setStepIndex(stepIndex + 1);

    const printMeldingSubmit = (formValues: PrintFormValues) => {
        setPrintMelding(formValues.beskrivelse);
        next();
        return Promise.resolve();
    };

    const velgPlanSubmit = (formValues: VelgPlanUtskriftFormValues) => {
        setUtskriftform(formValues.utskritPlanType);
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

    const getPrompt = () => {
        if (steps[stepIndex] === STEP_MELDING_FORM) {
            return (
                <Modal onClose={goBack} open>
                    <Innholdslaster avhengigheter={avhengigheter}>
                        <PrintMeldingForm bruker={bruker} onSubmit={printMeldingSubmit} />
                    </Innholdslaster>
                </Modal>
            );
        }
        if (steps[stepIndex] === STEP_VELG_PLAN) {
            return (
                <Modal onClose={goBack} open>
                    <Innholdslaster avhengigheter={avhengigheter}>
                        <VelgPlanUtskriftForm kvpPerioder={kvpPerioder} onSubmit={velgPlanSubmit} />
                    </Innholdslaster>
                </Modal>
            );
        }
    };
    const prompt = getPrompt();

    return (
        <section className="flex flex-col justify-center items-center p-8">
            <div className="aktivitetsplanprint flex justify-center items-center">
                {prompt}
                <ModalHeader
                    avhengigheter={avhengigheter}
                    tilbake={goBack}
                    kanSkriveUt={steps[stepIndex] === STEP_UTSKRIFT}
                />
                <Innholdslaster avhengigheter={avhengigheter}>
                    <div className="border px-12 print:border-none">
                        <Print
                            dialoger={dialoger}
                            bruker={bruker}
                            adresse={adresse}
                            printMelding={printMelding}
                            aktiviteter={aktiviteter}
                            mittMal={mittMal}
                            erVeileder={erVeileder}
                            utskriftPlanType={utskriftform}
                            kvpPerioder={kvpPerioder}
                        />
                    </div>
                </Innholdslaster>
            </div>
        </section>
    );
};

const mapStateToProps = (state: any) => {
    const aktiviteter = selectAktivitetListe(state);
    const kvpPerioder = selectKvpPeriodeForValgteOppfolging(state);
    const dialoger = selectDialoger(state);

    const mittMal = selectGjeldendeMal(state);
    const erManuell = selectErBrukerManuell(state);

    return {
        avhengigheter: [
            selectMalStatus(state),
            selectOppfolgingStatus(state),
            selectAktivitetListeStatus(state),
            selectDialogStatus(state),
        ],
        aktiviteter,
        dialoger,
        mittMal,
        erManuell,
        kvpPerioder,
    };
};

function mapDispatchToProps(dispatch: any, props: any) {
    return {
        doHentMal: () => dispatch(hentMal()),
        doHentMalListe: () => dispatch(hentMalListe()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsplanPrint);
