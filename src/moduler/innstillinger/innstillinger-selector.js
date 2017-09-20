function selectInnstillingerSlice(state) {
    return state.data.innstillinger;
}

export function selectInnstillingerStatus(state) {
    return selectInnstillingerSlice(state).status;
}

export function selectInnstillingerData(state) {
    return selectInnstillingerSlice(state).data;
}

export function selectAvslutningStatus(state) {
    return selectInnstillingerData(state).avslutningStatus;
}

export function selectInaktiveringsDato(state) {
    const avslutningStatus = selectAvslutningStatus(state);
    return avslutningStatus && avslutningStatus.inaktiveringsDato;
}

export function selectInnstillingerBegrunnelse(state) {
    return selectInnstillingerData(state).begrunnelse;
}

export function selectErManuell(state) {
    return selectInnstillingerData(state).manuell;
}

export function selectKanStarteOppfolging(state) {
    return selectInnstillingerData(state).kanStarteOppfolging;
}

export function selectBehandlendeEnheter(state) {
    return selectInnstillingerSlice(state).behandlendeEnheter;
}
