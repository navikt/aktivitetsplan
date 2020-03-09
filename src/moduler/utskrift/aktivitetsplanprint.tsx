import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Modal from '../../felles-komponenter/modal/modal';
import { selectAktivitetListe, selectAktivitetListeStatus } from '../aktivitet/aktivitetliste-selector';
import { selectBruker, selectBrukerStatus } from '../bruker/bruker-selector';
import { hentMal, selectGjeldendeMal, selectMalStatus } from '../mal/aktivitetsmal-reducer';
import { hentMalListe } from '../mal/malliste-reducer';
import Innholdslaster, { InnholdslasterProps } from '../../felles-komponenter/utils/innholdslaster';
import {
    selectErBrukerManuell,
    selectKvpPeriodeForValgteOppfolging,
    selectOppfolgingStatus
} from '../oppfolging-status/oppfolging-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import FnrProvider from '../../bootstrap/fnr-provider';
import { selectAlleDialoger, selectDialogStatus } from '../dialog/dialog-selector';
import loggEvent, { PRINT_MODSAL_OPEN } from '../../felles-komponenter/utils/logging';
import Print from './print/print';
import ModalHeader from './modalHeader';
import PrintMeldingForm from './printMelding';
import VelgPlanUtskriftForm from './velgPlan/velgPlanUtskriftForm';
import { Aktivitet, Bruker, Dialog, KvpPeriode, Mal } from '../../types';

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
        bruker,
        kvpPerioder,
        dialoger,
        mittMal,
        erVeileder,
        aktiviteter,
        erManuell
    } = props;

    useEffect(() => {
        doHentMal();
        doHentMalListe();
        loggEvent(PRINT_MODSAL_OPEN);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    return (
        <section>
            <FnrProvider>
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
            </FnrProvider>
        </section>
    );
}

const mapStateToProps = (state: any) => {
    const aktiviteter = selectAktivitetListe(state);
    const kvpPerioder = selectKvpPeriodeForValgteOppfolging(state);
    const dialoger = selectAlleDialoger(state);

    const bruker = selectBruker(state);
    const mittMal = selectGjeldendeMal(state);
    const erVeileder = selectErVeileder(state);
    const erManuell = selectErBrukerManuell(state);

    return {
        avhengigheter: [
            selectMalStatus(state),
            selectOppfolgingStatus(state),
            selectAktivitetListeStatus(state),
            selectBrukerStatus(state),
            selectDialogStatus(state)
        ],
        aktiviteter,
        dialoger,
        bruker,
        mittMal,
        erManuell,
        kvpPerioder,
        erVeileder
    };
};

function mapDispatchToProps(dispatch: any, props: any) {
    return {
        doResetUtskrift: () => {
            props.history.push('/');
        },
        doHentMal: () => dispatch(hentMal()),
        doHentMalListe: () => dispatch(hentMalListe())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsplanPrint);
