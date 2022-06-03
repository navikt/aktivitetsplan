import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { hentAdresse, hentPerson } from '../../api/personAPI';
import { Aktivitet } from '../../datatypes/aktivitetTypes';
import { Dialog } from '../../datatypes/dialogTypes';
import { KvpPeriode, Mal } from '../../datatypes/oppfolgingTypes';
import { Bruker, Postadresse } from '../../datatypes/types';
import Modal from '../../felles-komponenter/modal/Modal';
import Innholdslaster, { InnholdslasterProps } from '../../felles-komponenter/utils/Innholdslaster';
import loggEvent, { PRINT_MODSAL_OPEN } from '../../felles-komponenter/utils/logging';
import { getFodselsnummer } from '../../utils/fnr-util';
import { selectAktivitetListe, selectAktivitetListeStatus } from '../aktivitet/aktivitetlisteSelector';
import { selectDialogStatus, selectDialoger } from '../dialog/dialog-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import { hentMal, selectGjeldendeMal, selectMalStatus } from '../mal/aktivitetsmal-reducer';
import { hentMalListe } from '../mal/malliste-reducer';
import {
    selectErBrukerManuell,
    selectKvpPeriodeForValgteOppfolging,
    selectOppfolgingStatus,
} from '../oppfolging-status/oppfolging-selector';
import ModalHeader from './modalHeader';
import Print from './print/print';
import PrintMeldingForm from './printMelding';
import VelgPlanUtskriftForm from './velgPlan/velgPlanUtskriftForm';

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
    doResetUtskrift: () => void;
    bruker: Bruker;
    kvpPerioder?: KvpPeriode[];
    dialoger?: Dialog[];
    mittMal?: Mal;
    erVeileder?: boolean;
    aktiviteter?: Aktivitet[];
    erManuell?: boolean;
}

function AktivitetsplanPrint(props: Props) {
    const {
        doHentMal,
        doHentMalListe,
        avhengigheter,
        doResetUtskrift,
        kvpPerioder,
        dialoger,
        mittMal,
        erVeileder,
        aktiviteter,
        erManuell,
    } = props;

    useEffect(() => {
        doHentMal();
        doHentMalListe();
        loggEvent(PRINT_MODSAL_OPEN);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fnr = getFodselsnummer();
    const [adresse, setAdresse] = useState<null | Postadresse>(null);
    const [bruker, setBruker] = useState<Bruker>(tomBruker());

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

    const back = stepIndex > 0 ? () => setStepIndex(stepIndex - 1) : undefined;

    const next = () => setStepIndex(stepIndex + 1);

    const printMeldingSubmit = (printmelding: string) => {
        setPrintMelding(printmelding);
        next();
        return Promise.resolve();
    };

    const velgPlanSubmint = (plantype: string) => {
        setUtskriftform(plantype);
        next();
        return Promise.resolve();
    };

    const kanHaPrintValg = kvpPerioder && kvpPerioder.length > 0 && erVeileder;
    const kanHaPrintMelding = erManuell && erVeileder;

    const steps = getSteps(kanHaPrintValg, kanHaPrintMelding);
    if (fnr && (isLoadingAdresse || isLoadingBruker)) {
        return <></>;
    }
    return (
        <section>
            <Modal
                contentLabel="aktivitetsplanPrint"
                className="aktivitetsplanprint"
                header={
                    <ModalHeader
                        avhengigheter={avhengigheter}
                        tilbake={back}
                        kanSkriveUt={steps[stepIndex] === STEP_UTSKRIFT}
                    />
                }
                onRequestClose={doResetUtskrift}
            >
                <Innholdslaster avhengigheter={avhengigheter}>
                    <PrintMeldingForm
                        bruker={bruker}
                        onSubmit={printMeldingSubmit}
                        hidden={steps[stepIndex] !== STEP_MELDING_FORM}
                    />
                    <VelgPlanUtskriftForm
                        kvpPerioder={kvpPerioder}
                        onSubmit={velgPlanSubmint}
                        hidden={steps[stepIndex] !== STEP_VELG_PLAN}
                    />
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
                        hidden={steps[stepIndex] !== STEP_UTSKRIFT}
                    />
                </Innholdslaster>
            </Modal>
        </section>
    );
}

const mapStateToProps = (state: any) => {
    const aktiviteter = selectAktivitetListe(state);
    const kvpPerioder = selectKvpPeriodeForValgteOppfolging(state);
    const dialoger = selectDialoger(state);

    const mittMal = selectGjeldendeMal(state);
    const erVeileder = selectErVeileder(state);
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
        erVeileder,
    };
};

function tomBruker(): Bruker {
    return {};
}

function mapDispatchToProps(dispatch: any, props: any) {
    return {
        doResetUtskrift: () => {
            props.history.push('/');
        },
        doHentMal: () => dispatch(hentMal()),
        doHentMalListe: () => dispatch(hentMalListe()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsplanPrint);
