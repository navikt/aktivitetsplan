import { useEffect, useRef } from 'react';

import { SerializedError } from '../../api/utils';
import loggEvent from '../../felles-komponenter/utils/logging';
import { hentAktiviteter } from '../aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../aktivitet/arena-aktiviteter-slice';
import { hentDialoger } from '../dialog/dialog-slice';
import { hentIdentitet } from '../identitet/identitet-slice';
import { hentOppfolging } from '../oppfolging-status/oppfolging-slice';

export function useFeilMetrikker(feilmeldinger: SerializedError[]) {
    const sendtFeiltype = useRef(new Set());
    const sentErrors = useRef(new Set());

    const harSendtLastet = useRef(false);

    if (!harSendtLastet.current) {
        loggEvent('aktivitesplan.lastet');
        harSendtLastet.current = true;
    }

    useEffect(() => {
        sendFeiltyperMetrikk(feilmeldinger, sendtFeiltype);
        sendFeilMetrikk(feilmeldinger, sentErrors);
    }, [feilmeldinger]);
}

function sendFeiltyperMetrikk(feilmeldinger: SerializedError[], sendtFeiltype: React.MutableRefObject<Set<any>>) {
    const feil = feilmeldinger.map((feil) => klassifiserFeil(feil));
    new Set(feil) //fjerner duplikater
        .forEach((feil) => {
            if (!sendtFeiltype.current.has(feil)) {
                sendtFeiltype.current.add(feil);
                loggEvent('aktivitetsplan.feil', { feil_kategori: feil }, { feil_kategori_tag: feil });
            }
        });
}

function sendFeilMetrikk(feilmeldinger: SerializedError[], sentErrors: React.MutableRefObject<Set<any>>) {
    const feil = feilmeldinger.filter((feil) => feil.code !== '403' && feil.code !== '401');
    new Set(feil) //fjerner duplikater
        .forEach((feilmelding) => {
            const feil = feilmelding.type;
            if (!sentErrors.current.has(feil)) {
                sentErrors.current.add(feil);
                loggEvent('aktivitetsplan.feiltype', { feil, feil_kategori: klassifiserFeil(feilmelding) });
            }
        });
}

type ErrorSeverity = 'unauthorized' | 'forbidden' | 'critical' | 'degraded' | 'unknown';

function klassifiserFeil(feil: SerializedError): ErrorSeverity {
    if (feil.code === '403') {
        return 'forbidden';
    } else if (feil.code === '401') {
        return 'unauthorized';
    }

    switch (feil.type) {
        case hentIdentitet.rejected.type:
        case hentAktiviteter.rejected.type:
        case hentOppfolging.rejected.type:
            return 'critical';
        case hentArenaAktiviteter.rejected.type:
        case hentDialoger.rejected.type:
            return 'degraded';
        default:
            return 'unknown';
    }
}
