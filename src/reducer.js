import { combineReducers } from 'redux';
import { reducer as formReducer } from 'react-redux-form-validation';
import aktiverDigitalOppfolgingReducer from './moduler/aktiver-digital-oppfolging/aktiver-digital-oppfolging-reducer';
import aktiviteterReducer from './moduler/aktivitet/aktivitet-reducer';
import arbeidslisteReducer from './moduler/arbeidsliste/arbeidsliste-reducer';
import arenaAktiviteterReducer from './ducks/arena-aktiviteter';
import behandlendeEnheterReducer from './moduler/innstillinger/opprett-oppgave/hent-behandlende-enheter-reducer';
import brukerReducer from './moduler/bruker/bruker-duck';
import dialogReducer from './ducks/dialog';
import dialogViewReducer from './moduler/dialog/dialog-view-reducer';
import etiketterReducer from './ducks/etiketter';
import filterReducer from './moduler/filtrering/filter/filter-reducer';
import historikkReducer from './moduler/innstillinger/historikk/historikk-reducer';
import historiskeVilkarReducer from './moduler/vilkar/historiske-vilkar';
import identitetReducer from './moduler/identitet/identitet-duck';
import innstillingerReducer from './moduler/innstillinger/innstillinger-reducer';
import kanalerReducer from './moduler/aktivitet/kanaler-reducer';
import ledetekstReducer from './ducks/ledetekster-ressurs';
import malListeReducer from './moduler/mal/malliste-reducer';
import malReducer from './moduler/mal/mal-reducer';
import motpartReducer from './moduler/motpart/motpart-duck';
import oppgaveReducer from './moduler/innstillinger/opprett-oppgave/opprett-oppgave-reducer';
import oppgaveVeiledereReducer from './moduler/innstillinger/opprett-oppgave/hent-veieldere-for-oppgave-reducer';
import referatReducer from './moduler/aktivitet/aktivitet-referat-reducer';
import situasjonReducer from './moduler/situasjon/situasjon';
import utskriftReducer from './moduler/utskrift/utskrift-duck';
import veilederReducer from './ducks/veileder';
import versjonReducer from './ducks/aktivitet-versjoner';
import vilkarReducer from './moduler/vilkar/vilkar-reducer';

export const RESET_STORE = { type: 'store/reset' };

const combinedReducers = combineReducers({
    form: formReducer,
    data: combineReducers({
        aktiverDigitalOppfolging: aktiverDigitalOppfolgingReducer,
        aktiviteter: aktiviteterReducer,
        arbeidsliste: arbeidslisteReducer,
        arenaAktiviteter: arenaAktiviteterReducer,
        behandlendeEnheter: behandlendeEnheterReducer,
        bruker: brukerReducer,
        dialog: dialogReducer,
        etiketter: etiketterReducer,
        filter: filterReducer,
        historiskeVilkar: historiskeVilkarReducer,
        identitet: identitetReducer,
        innstillinger: innstillingerReducer,
        innstillingerHistorikk: historikkReducer,
        kanaler: kanalerReducer,
        ledetekster: ledetekstReducer,
        mal: malReducer,
        malListe: malListeReducer,
        motpart: motpartReducer,
        oppgaveVeiledere: oppgaveVeiledereReducer,
        opprettOppgave: oppgaveReducer,
        referat: referatReducer,
        situasjon: situasjonReducer,
        veiledere: veilederReducer,
        versjoner: versjonReducer,
        vilkar: vilkarReducer,
    }),
    view: combineReducers({
        dialog: dialogViewReducer,
        utskrift: utskriftReducer,
    }),
});

export default function(state, action) {
    if (action.type === RESET_STORE.type) {
        return combinedReducers(undefined, action);
    }
    return combinedReducers(state, action);
}
