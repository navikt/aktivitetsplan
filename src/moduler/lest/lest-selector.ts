import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';

function selectLestSlice(state: RootState) {
    return state.data.lest;
}

function selectLestData(state: RootState) {
    return selectLestSlice(state).data;
}

function selectLestRessurs(state: RootState, ressurs: string) {
    return selectLestData(state).filter((lest) => lest.ressurs === ressurs)[0];
}

export function selectLestInformasjon(state: RootState) {
    return selectLestRessurs(state, 'informasjon');
}

export function selectLestAktivitetsplan(state: RootState) {
    return selectLestRessurs(state, 'aktivitetsplan');
}

export function selectLestStatus(state: RootState) {
    return selectLestSlice(state).status;
}

export function selectLestFeilMelding(state: RootState) {
    const feilMeldingsdata = selectLestStatus(state) === Status.ERROR && selectLestSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
}
