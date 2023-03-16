import {FeilmeldingType} from "./FeilmeldingTypes";
import {useEffect, useRef} from "react";
import { HENTING_FEILET as AKTIVITET_HENT_FEILET, NIVAA_4_FEILET } from '../aktivitet/aktivitet-action-types';
import { HENTING_FEILET as ARENA_HENT_FEILET } from '../aktivitet/arena-aktiviteter-reducer';
import { HENTING_FEILET as DIALOG_HENT_FEIL } from '../dialog/dialog-reducer';
import {FEILET as OPPFOLGING_FEILET} from "../oppfolging-status/oppfolging-reducer";
import loggEvent from "../../felles-komponenter/utils/logging";

export function useFeilMetrikker(feilmeldinger: FeilmeldingType[]) {
    const sentErrors = useRef(new Set());
    const harSendtLastet = useRef(false);

    if(!harSendtLastet.current) {
        loggEvent("aktivitesplan.lastet");
        harSendtLastet.current = true;
    }

    useEffect(() => {
        const feil = feilmeldinger.map(feil => klassifiserFeil(feil));
        new Set(feil) //fjerner duplikater
            .forEach(feil => {
                if(!sentErrors.current.has(feil)) {
                    sentErrors.current.add(feil);
                    sendFeil(feil);
                }
            });
    }, [feilmeldinger]);
}

type ErrorSeverity = "unauthorized" | "forbidden" | "critical" | "degraded" | "unknown";

function klassifiserFeil(feil: FeilmeldingType): ErrorSeverity {
    if(feil.httpStatus === 403) {
        return "forbidden";
    } else if(feil.httpStatus === 401) {
        return "unauthorized";
    }

    switch (feil.type) {
        case "IDENTITET/FEILET":
        case AKTIVITET_HENT_FEILET:
        case OPPFOLGING_FEILET:
            return "critical";
        case ARENA_HENT_FEILET:
        case DIALOG_HENT_FEIL:
        case NIVAA_4_FEILET:
            return "degraded";
        default:
            return "unknown";
    }
}

function sendFeil(feil_kategori: string) {
    loggEvent("aktivitetsplan.feil", {feil_kategori});
}

