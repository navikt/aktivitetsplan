import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import { STATUS_AVBRUTT, STATUS_FULLFOERT, UTDANNING_AKTIVITET_TYPE } from '../../../../constant';
import AvtaltForm, {
    Handler,
    IKKE_SEND_FORHANDSORIENTERING,
    SEND_FORHANDSORIENTERING,
    SEND_PARAGRAF_11_9
} from './avtalt-form';
import { oppdaterAktivitet } from '../../aktivitet-actions';
import { STATUS } from '../../../../ducks/utils';
import { selectAktiviteterData, selectAktivitetStatus } from '../../aktivitet-selector';
import { erGyldigISODato, erMerEnnSyvDagerTil, msSince } from '../../../../utils';
import { sendForhandsorientering } from '../../../dialog/dialog-reducer';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectOppfolgingsPerioder,
    selectReservasjonKRR
} from '../../../oppfolging-status/oppfolging-selector';
import { apneDialog } from '../underelement-for-aktivitet/underelementer-view-reducer';
import { loggForhandsorientering, metrikkTidForsteAvtalte } from '../../../../felles-komponenter/utils/logging';
import DeleLinje from '../delelinje/delelinje';
import { Aktivitet, OppfolgingsPeriode } from '../../../../types';
import { selectErBruker } from '../../../identitet/identitet-selector';
import { useHarFeature, VIS_NY_DIALOG } from '../../../../felles-komponenter/feature/feature';
import { createSelectDialogForAktivitetId } from '../../../dialog/dialog-selector';
import LenkeTilDialog from '../../../dialog/DialogLink';

interface Props {
    underOppfolging: boolean;
    aktivitet: Aktivitet;
    className: string;
}

const avtaltTextMap = {
    [SEND_FORHANDSORIENTERING]: (avtaltForm: any) => avtaltForm.avtaltText,
    [SEND_PARAGRAF_11_9]: (avtaltForm: any) => avtaltForm.avtaltText119,
    [IKKE_SEND_FORHANDSORIENTERING]: () => ''
};

function AvtaltContainer(props: Props) {
    const { underOppfolging, aktivitet, className } = props;
    const [visBekreftAvtalt, setVisBekreftAvtalt] = useState(false);
    const [forhandsorienteringSent, setForhandsorienteringSent] = useState(false);
    const [forhandsorienteringType, setForhandsorienteringType] = useState('');
    const dispatch = useDispatch();

    const doSetAktivitetTilAvtalt = (aktivitet: Aktivitet) =>
        dispatch(oppdaterAktivitet({ ...aktivitet, avtalt: true }));
    const doSendForhandsorientering = (aktivitet: Aktivitet, avtaltTekst: String) => {
        dispatch(
            sendForhandsorientering({
                aktivitetId: aktivitet.id,
                tekst: avtaltTekst,
                overskrift: aktivitet.tittel
            })
        );
    };
    const doApneDialog = () => dispatch(apneDialog());

    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const harAvtalteAktiviteter =
        useSelector<any, Aktivitet[]>(selectAktiviteterData)
            .filter(aktivitet => aktivitet.avtalt)
            .filter(a => !a.historisk).length !== 0;

    const aktivOppfolgingsPeriode = useSelector<any, OppfolgingsPeriode[]>(selectOppfolgingsPerioder).filter(
        periode => !periode.sluttDato
    )[0];
    const erManuell = useSelector(selectErBrukerManuell);
    const erKvp = useSelector(selectErUnderKvp);
    const erreservertKRR = useSelector(selectReservasjonKRR);
    const erBruker = useSelector(selectErBruker);
    const nyDialog = useHarFeature(VIS_NY_DIALOG);
    const dialog = useSelector(createSelectDialogForAktivitetId(aktivitet.id));
    const dialogId = dialog && dialog.id;

    const erManuellKrrKvpBruker = erManuell || erKvp || erreservertKRR;

    const { type, status, historisk, avtalt } = aktivitet;

    const lasterData = aktivitetStatus !== STATUS.OK;
    const oppdaterer = aktivitetStatus === STATUS.RELOADING;
    const arenaAktivitet = UTDANNING_AKTIVITET_TYPE === type;
    const merEnnsyvDagerTil = erMerEnnSyvDagerTil(aktivitet.tilDato);
    const visAvtaltMedNavMindreEnnSyvDager = !avtalt && !merEnnsyvDagerTil;

    if (
        erBruker ||
        historisk ||
        !underOppfolging ||
        status === STATUS_FULLFOERT ||
        status === STATUS_AVBRUTT ||
        arenaAktivitet
    ) {
        return null;
    }

    // Kun vis bekreftet hvis nettopp satt til avtalt.
    if (!visBekreftAvtalt && avtalt) {
        return null;
    }

    if (avtalt) {
        const settAvtaltTekstVerdi =
            (!merEnnsyvDagerTil && 'avtaltMedNavMindreEnnSyvDager') ||
            (erManuellKrrKvpBruker && 'erManuellKrrKvpBruker') ||
            (forhandsorienteringSent && 'forhandsorienteringSent') ||
            (!forhandsorienteringSent && 'forhandsorienteringIkkeSent');

        return (
            <div>
                <div className={className}>
                    <AlertStripeSuksess>
                        <FormattedMessage
                            id="sett-avtalt-bekreftelse"
                            values={{
                                settAvtaltTekstVerdi,
                                forhandsorienteringType
                            }}
                        />
                        <LenkeTilDialog dialogId={dialogId} hidden={!forhandsorienteringSent || !nyDialog} className="">
                            Se meldingen
                        </LenkeTilDialog>
                    </AlertStripeSuksess>
                </div>
                <DeleLinje />
            </div>
        );
    }

    const onSubmit: Handler = avtaltForm => {
        setVisBekreftAvtalt(true);
        // @ts-ignore
        const avtaltText = avtaltTextMap[avtaltForm.avtaltSelect](avtaltForm);
        const skalSendeVarsel = !!avtaltText && merEnnsyvDagerTil && !erManuellKrrKvpBruker;
        if (skalSendeVarsel) {
            doSendForhandsorientering(aktivitet, avtaltText);
            setForhandsorienteringSent(true);
            setForhandsorienteringType(avtaltForm.avtaltSelect);
            if (!nyDialog) {
                doApneDialog();
            }
        }

        loggForhandsorientering(erManuellKrrKvpBruker, !merEnnsyvDagerTil, avtaltForm.avtaltSelect);

        if (!harAvtalteAktiviteter && aktivOppfolgingsPeriode && erGyldigISODato(aktivOppfolgingsPeriode.startDato)) {
            metrikkTidForsteAvtalte(msSince(aktivOppfolgingsPeriode.startDato));
        }

        doSetAktivitetTilAvtalt(aktivitet);

        // @ts-ignore
        document.querySelector('.aktivitet-modal').focus();
        return Promise.resolve();
    };

    return (
        <div>
            <AvtaltForm
                className={`${className} avtalt-container`}
                oppdaterer={oppdaterer}
                visAvtaltMedNavMindreEnnSyvDager={visAvtaltMedNavMindreEnnSyvDager}
                erManuellKrrKvpBruker={erManuellKrrKvpBruker}
                lasterData={lasterData}
                onSubmit={onSubmit}
            />
            <DeleLinje />
        </div>
    );
}

export default AvtaltContainer;
