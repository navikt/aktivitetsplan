import {
    selectOppfolgingHistorikkSlice,
    selectOppgaveHistorikkSlice,
} from './historikk/historikk-selector';
import { STATUS } from '../../ducks/utils';

export function selectInnstillingerSlice(state) {
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
    return selectInnstillingerSlice(state).begrunnelse;
}

export function selectErManuell(state) {
    return selectInnstillingerData(state).manuell;
}

export function selectKanStarteOppfolging(state) {
    return selectInnstillingerData(state).kanStarteOppfolging;
}

export function selectInnstillingModalFeilmeldinger(state) {
    const innstillingModalSlice = {
        opprettOppgave: state.data.opprettOppgave,
        oppfolgingHistorikk: selectOppfolgingHistorikkSlice(state),
        oppgaveHistorikk: selectOppgaveHistorikkSlice(state),
        innstillinger: selectInnstillingerSlice(state),
    };

    return Object.keys(innstillingModalSlice)
        .filter(key => innstillingModalSlice[key].status === STATUS.ERROR)
        .map(key => innstillingModalSlice[key].feil)
        .filter(x => x);
}
