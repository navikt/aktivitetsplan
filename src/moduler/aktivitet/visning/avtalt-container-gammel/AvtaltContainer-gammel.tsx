import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../../api/utils';
import { STATUS_AVBRUTT, STATUS_FULLFOERT, UTDANNING_AKTIVITET_TYPE } from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { OppfolgingsPeriode } from '../../../../datatypes/oppfolgingTypes';
import { useSkalBrukeNyForhaandsorientering } from '../../../../felles-komponenter/feature/feature';
import { loggForhandsorientering, metrikkTidForsteAvtalte } from '../../../../felles-komponenter/utils/logging';
import { erGyldigISODato, erMerEnnSyvDagerTil, msSince } from '../../../../utils';
import { sendForhandsorientering } from '../../../dialog/dialog-reducer';
import { createSelectDialogForAktivitetId } from '../../../dialog/dialog-selector';
import LenkeTilDialog from '../../../dialog/DialogLink';
import { selectErBruker } from '../../../identitet/identitet-selector';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectOppfolgingsPerioder,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';
import { selectNivaa4 } from '../../../tilgang/tilgang-selector';
import { oppdaterAktivitet } from '../../aktivitet-actions';
import { selectAktivitetStatus, selectAktiviteterData } from '../../aktivitet-selector';
import DeleLinje from '../delelinje/delelinje';
import AvtaltForm, {
    Handler,
    IKKE_SEND_FORHANDSORIENTERING,
    SEND_FORHANDSORIENTERING,
    SEND_PARAGRAF_11_9,
} from './AvtaltForm';

interface Props {
    underOppfolging: boolean;
    aktivitet: Aktivitet;
    className: string;
}

const avtaltTextMap = {
    [SEND_FORHANDSORIENTERING]: (avtaltForm: any) => avtaltForm.avtaltText,
    [SEND_PARAGRAF_11_9]: (avtaltForm: any) => avtaltForm.avtaltText119,
    [IKKE_SEND_FORHANDSORIENTERING]: () => '',
};

const AvtaltContainerGammel = (props: Props) => {
    const { underOppfolging, aktivitet, className } = props;
    const brukeNyForhaandsorientering = useSkalBrukeNyForhaandsorientering();

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
                overskrift: aktivitet.tittel,
            })
        );
    };
    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const harAvtalteAktiviteter =
        useSelector<any, Aktivitet[]>(selectAktiviteterData)
            .filter((aktivitet) => aktivitet.avtalt)
            .filter((a) => !a.historisk).length !== 0;

    const aktivOppfolgingsPeriode = useSelector<any, OppfolgingsPeriode[]>(selectOppfolgingsPerioder).filter(
        (periode) => !periode.sluttDato
    )[0];
    const erManuell = useSelector(selectErBrukerManuell);
    const erKvp = useSelector(selectErUnderKvp);
    const erreservertKRR = useSelector(selectReservasjonKRR);
    const erBruker = useSelector(selectErBruker);
    const dialog = useSelector(createSelectDialogForAktivitetId(aktivitet.id));
    const harLoggetInnNivaa4 = useSelector(selectNivaa4);

    if (brukeNyForhaandsorientering) {
        return null;
    }

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
                                forhandsorienteringType,
                            }}
                        />
                        <LenkeTilDialog dialogId={dialogId} hidden={!forhandsorienteringSent} className="">
                            Se meldingen
                        </LenkeTilDialog>
                    </AlertStripeSuksess>
                </div>
                <DeleLinje />
            </div>
        );
    }

    const onSubmit: Handler = (avtaltForm) => {
        setVisBekreftAvtalt(true);
        // @ts-ignore
        const avtaltText = avtaltTextMap[avtaltForm.avtaltSelect](avtaltForm);
        const skalSendeVarsel = !!avtaltText && merEnnsyvDagerTil && !erManuellKrrKvpBruker && harLoggetInnNivaa4;
        if (skalSendeVarsel) {
            doSendForhandsorientering(aktivitet, avtaltText);
            setForhandsorienteringSent(true);
            setForhandsorienteringType(avtaltForm.avtaltSelect);
        }

        loggForhandsorientering(erManuellKrrKvpBruker, !merEnnsyvDagerTil, avtaltForm.avtaltSelect, aktivitet.type);

        if (!harAvtalteAktiviteter && aktivOppfolgingsPeriode && erGyldigISODato(aktivOppfolgingsPeriode.startDato)) {
            metrikkTidForsteAvtalte(msSince(aktivOppfolgingsPeriode.startDato));
        }

        doSetAktivitetTilAvtalt(aktivitet);

        // @ts-ignore
        document.querySelector('.aktivitet-modal').focus();
        return Promise.resolve();
    };

    return (
        <>
            <AvtaltForm
                aktivitetId={aktivitet.id}
                className={`${className} avtalt-container`}
                oppdaterer={oppdaterer}
                visAvtaltMedNavMindreEnnSyvDager={visAvtaltMedNavMindreEnnSyvDager}
                erManuellKrrKvpBruker={erManuellKrrKvpBruker}
                lasterData={lasterData}
                onSubmit={onSubmit}
            />
            <DeleLinje />
        </>
    );
};

export default AvtaltContainerGammel;
