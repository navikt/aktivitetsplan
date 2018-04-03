import { aggregerStatus } from '../../../ducks/utils';

function selectOppfolgingHistorikkSlice(state) {
    return state.data.oppfolgingHistorikk;
}

function selectOppgaveHistorikkSlice(state) {
    return state.data.oppgaveHistorikk;
}

export function selectInnstillingHistorikkStatus(state) {
    return aggregerStatus(
        selectOppfolgingHistorikkSlice(state),
        selectOppgaveHistorikkSlice(state)
    );
}

export function selectInnstillingHistorikk(state) {
    const oppfolgingData = selectOppfolgingHistorikkSlice(state).data;
    const oppgaveData = selectOppgaveHistorikkSlice(state).data;
    return [...oppfolgingData, ...oppgaveData];
}
