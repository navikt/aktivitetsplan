import { combineReducers } from 'redux';
import { reducer as formReducer } from 'react-redux-form-validation';
import ledetekstReducer from './ducks/ledetekster-reducer';
import oppfolgingReducer from './moduler/oppfolging-status/oppfolging-reducer';
import vilkarReducer from './moduler/vilkar/vilkar-reducer';
import aktiviteterReducer from './moduler/aktivitet/aktivitet-reducer';
import arenaAktiviteterReducer from './moduler/aktivitet/arena-aktiviteter-reducer';
import kanalerReducer from './moduler/aktivitet/kanaler-reducer';
import referatReducer from './moduler/aktivitet/aktivitet-referat-reducer';
import etiketterReducer from './felles-komponenter/aktivitet-etikett/aktivitet-etiketter-reducer';
import versjonReducer from './moduler/aktivitet/aktivitet-versjoner-reducer';
import dialogReducer from './moduler/dialog/dialog-reducer';
import malReducer from './moduler/mal/aktivitetsmal-reducer';
import malListeReducer from './moduler/mal/malliste-reducer';
import identitetReducer from './moduler/identitet/identitet-reducer';
import motpartReducer from './moduler/motpart/motpart-reducer';
import historiskeVilkarReducer from './moduler/vilkar/historiske-vilkar';
import filterReducer from './moduler/filtrering/filter/filter-reducer';
import veilederReducer from './ducks/veileder-reducer';
import historikkReducer from './moduler/innstillinger/historikk/historikk-reducer';
import innstillingerReducer from './moduler/innstillinger/innstillinger-reducer';
import aktiverDigitalOppfolgingReducer from './moduler/aktiver-digital-oppfolging/aktiver-digital-oppfolging-reducer';
import arbeidslisteReducer from './moduler/arbeidsliste/arbeidsliste-reducer';
import oppgaveReducer from './moduler/innstillinger/opprett-oppgave/opprett-oppgave-reducer';
import brukerReducer from './moduler/bruker/bruker-reducer';
import utskriftReducer from './moduler/utskrift/utskrift-duck';
import behandlendeEnheterReducer from './moduler/innstillinger/opprett-oppgave/hent-behandlende-enheter-reducer';
import oppgaveVeiledereReducer from './moduler/innstillinger/opprett-oppgave/hent-veieldere-for-oppgave-reducer';

export const RESET_STORE = { type: 'store/reset' };

const combinedReducers = combineReducers({
    form: formReducer,
    data: combineReducers({
        ledetekster: ledetekstReducer,
        oppfolging: oppfolgingReducer,
        innstillinger: innstillingerReducer,
        vilkar: vilkarReducer,
        historiskeVilkar: historiskeVilkarReducer,
        aktiviteter: aktiviteterReducer,
        arenaAktiviteter: arenaAktiviteterReducer,
        etiketter: etiketterReducer,
        versjoner: versjonReducer,
        dialog: dialogReducer,
        mal: malReducer,
        malListe: malListeReducer,
        motpart: motpartReducer,
        identitet: identitetReducer,
        filter: filterReducer,
        veiledere: veilederReducer,
        innstillingerHistorikk: historikkReducer,
        aktiverDigitalOppfolging: aktiverDigitalOppfolgingReducer,
        arbeidsliste: arbeidslisteReducer,
        kanaler: kanalerReducer,
        referat: referatReducer,
        opprettOppgave: oppgaveReducer,
        bruker: brukerReducer,
        behandlendeEnheter: behandlendeEnheterReducer,
        oppgaveVeiledere: oppgaveVeiledereReducer,
    }),
    view: combineReducers({
        utskrift: utskriftReducer,
    }),
});

export default function(state, action) {
    if (action.type === RESET_STORE.type) {
        return combinedReducers(undefined, action);
    }
    return combinedReducers(state, action);
}
