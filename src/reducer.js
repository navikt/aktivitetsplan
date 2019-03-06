import { combineReducers } from 'redux';
import { reducer as formReducer } from 'react-redux-form-validation';
import aktiviteterReducer from './moduler/aktivitet/aktivitet-reducer';
import arbeidslisteReducer from './moduler/arbeidsliste/arbeidsliste-reducer';
import arenaAktiviteterReducer from './moduler/aktivitet/arena-aktiviteter-reducer';
import behandlendeEnheterReducer from './moduler/innstillinger/opprett-oppgave/hent-behandlende-enheter-reducer';
import brukerReducer from './moduler/bruker/bruker-reducer';
import dialogReducer from './moduler/dialog/dialog-reducer';
import dialogViewReducer from './moduler/dialog/dialog-view-reducer';
import featureReducer from './ducks/feature-reducer';
import filterReducer from './moduler/filtrering/filter/filter-reducer';
import oppgaveHistorikkReducer from './moduler/innstillinger/historikk/oppgave-historikk-reducer';
import oppfolgingHistorikkReducer from './moduler/innstillinger/historikk/oppfolging-historikk-reducer';
import identitetReducer from './moduler/identitet/identitet-reducer';
import innstillingerReducer from './moduler/innstillinger/innstillinger-reducer';
import malListeReducer from './moduler/mal/malliste-reducer';
import malReducer from './moduler/mal/aktivitetsmal-reducer';
import oppgaveReducer from './moduler/innstillinger/opprett-oppgave/opprett-oppgave-reducer';
import oppgaveVeiledereReducer from './moduler/innstillinger/opprett-oppgave/hent-veieldere-for-oppgave-reducer';
import veilederePaEnhetReducer from './moduler/veiledere-pa-enhet/veiledere-pa-enhet-reducer';
import tildelVeilederReducer from './moduler/tildel-veileder/tildel-veileder-reducer';
import oppfolgingReducer from './moduler/oppfolging-status/oppfolging-reducer';
import oppfolgingstatusReducer from './moduler/oppfoelgingsstatus/oppfoelgingsstatus-reducer';
import utskriftReducer from './moduler/utskrift/utskrift-duck';
import versjonReducer from './moduler/aktivitet/aktivitet-versjoner/aktivitet-versjoner-reducer';
import veilederTilgangReducer from './felles-komponenter/veilederTilgang/veileder-tilgang-reducer';
import malverkReducer from './moduler/malverk/malverk-reducer';
import underelmenterReducer from './moduler/aktivitet/visning/underelement-for-aktivitet/underelementer-view-reducer';
import authReducer from './felles-komponenter/timeoutbox/auth-reducer';
import lestReducer from './moduler/lest/lest-reducer';
import aktivitetViewReducer from './moduler/aktivitet/aktivitetview-reducer';

export const RESET_STORE = { type: 'store/reset' };

const combinedReducers = combineReducers({
    form: formReducer,
    data: combineReducers({
        aktiviteter: aktiviteterReducer,
        arbeidsliste: arbeidslisteReducer,
        arenaAktiviteter: arenaAktiviteterReducer,
        behandlendeEnheter: behandlendeEnheterReducer,
        bruker: brukerReducer,
        dialog: dialogReducer,
        filter: filterReducer,
        identitet: identitetReducer,
        innstillinger: innstillingerReducer,
        oppgaveHistorikk: oppgaveHistorikkReducer,
        oppfolgingHistorikk: oppfolgingHistorikkReducer,
        mal: malReducer,
        malListe: malListeReducer,
        oppgaveVeiledere: oppgaveVeiledereReducer,
        opprettOppgave: oppgaveReducer,
        oppfolging: oppfolgingReducer,
        oppfoelgingsstatus: oppfolgingstatusReducer,
        versjoner: versjonReducer,
        feature: featureReducer,
        veilederTilgang: veilederTilgangReducer,
        malverk: malverkReducer,
        veilederePaEnhet: veilederePaEnhetReducer,
        tildelVeileder: tildelVeilederReducer,
        lest: lestReducer,
        auth: authReducer,
    }),
    view: combineReducers({
        dialog: dialogViewReducer,
        utskrift: utskriftReducer,
        underelementer: underelmenterReducer,
        visteAktiviteterMedEndringer: aktivitetViewReducer,
    }),
});

export default function(state, action) {
    if (action.type === RESET_STORE.type) {
        return combinedReducers(undefined, action);
    }
    return combinedReducers(state, action);
}
