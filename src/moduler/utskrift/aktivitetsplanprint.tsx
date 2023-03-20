import { Loader, Modal } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { hentAdresse, hentPerson } from '../../api/personAPI';
import { AlleAktiviteter } from '../../datatypes/aktivitetTypes';
import { Dialog } from '../../datatypes/dialogTypes';
import { KvpPeriode, Mal } from '../../datatypes/oppfolgingTypes';
import { Bruker, Postadresse } from '../../datatypes/types';
import Innholdslaster, { InnholdslasterProps } from '../../felles-komponenter/utils/Innholdslaster';
import loggEvent, { PRINT_MODSAL_OPEN } from '../../felles-komponenter/utils/logging';
import { hentFnrFraUrl } from '../../utils/fnr-util';
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
    aktiviteter?: AlleAktiviteter[];
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

    const fnr = hentFnrFraUrl();
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
    const history = useHistory();
    const goBack = () => history.goBack();

    if (fnr && (isLoadingAdresse || isLoadingBruker)) {
        return <Loader />;
    }

    if (steps[stepIndex] === STEP_MELDING_FORM) {
        return (
            <Modal onClose={goBack} open>
                <Innholdslaster avhengigheter={avhengigheter}>
                    <PrintMeldingForm bruker={bruker} onSubmit={printMeldingSubmit} />
                </Innholdslaster>
            </Modal>
        );
    }

    if (steps[stepIndex] === STEP_MELDING_FORM) {
        return (
            <Modal onClose={goBack} open>
                <Innholdslaster avhengigheter={avhengigheter}>
                    <VelgPlanUtskriftForm kvpPerioder={kvpPerioder} onSubmit={velgPlanSubmint} />
                </Innholdslaster>
            </Modal>
        );
    }

    return (
        <section className="flex flex-col justify-center items-center p-8">
            <div
                className="aktivitetsplanprint w-[670px] flex justify-center items-center"
                // onRequestClose={doResetUtskrift}
            >
                <ModalHeader
                    avhengigheter={avhengigheter}
                    tilbake={goBack}
                    kanSkriveUt={steps[stepIndex] === STEP_UTSKRIFT}
                />
                <Innholdslaster avhengigheter={avhengigheter}>
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
            </div>
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
