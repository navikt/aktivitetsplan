import { combineReducers } from 'redux';
import { reducer as formReducer } from 'react-redux-form-validation';
import ledetekstReducer from './ducks/ledetekster-ressurs';
import situasjonReducer from './ducks/situasjon';
import vilkarReducer from './moduler/vilkar/vilkar-reducer';
import aktiviteterReducer from './moduler/aktivitet/aktivitet-reducer';
import arenaAktiviteterReducer from './ducks/arena-aktiviteter';
import kanalerReducer from './moduler/aktivitet/kanaler-reducer';
import referatReducer from './moduler/aktivitet/aktivitet-referat-reducer';
import etiketterReducer from './ducks/etiketter';
import versjonReducer from './ducks/aktivitet-versjoner';
import dialogReducer from './ducks/dialog';
import malReducer from './ducks/mal';
import identitetReducer from './ducks/identitet';
import motpartReducer from './moduler/motpart/motpart-duck';
import endreAktivitetReducer from './ducks/endre-aktivitet';
import feilReducer from './ducks/feil';
import historiskeVilkarReducer from './ducks/historiske-vilkar';
import filterReducer from './moduler/filter/filter-reducer';
import veilederReducer from './ducks/veileder';
import historikkReducer from './moduler/innstillinger/historikk/historikk-reducer';
import innstillingerReducer from './moduler/innstillinger/innstillinger-reducer';
import aktiverDigitalOppfolgingReducer from './moduler/aktiver-digital-oppfolging/aktiver-digital-oppfolging-reducer';
import arbeidslisteReducer from './moduler/arbeidsliste/arbeidsliste-reducer';

export const RESET_STORE = { type: 'store/reset' };

const combinedReducers = combineReducers({
    form: formReducer,
    data: combineReducers({
        ledetekster: ledetekstReducer,
        situasjon: situasjonReducer,
        innstillinger: innstillingerReducer,
        vilkar: vilkarReducer,
        historiskeVilkar: historiskeVilkarReducer,
        aktiviteter: aktiviteterReducer,
        arenaAktiviteter: arenaAktiviteterReducer,
        etiketter: etiketterReducer,
        versjoner: versjonReducer,
        dialog: dialogReducer,
        mal: malReducer,
        motpart: motpartReducer,
        identitet: identitetReducer,
        filter: filterReducer,
        veiledere: veilederReducer,
        innstillingerHistorikk: historikkReducer,
        aktiverDigitalOppfolging: aktiverDigitalOppfolgingReducer,
        arbeidsliste: arbeidslisteReducer,
        kanaler: kanalerReducer,
        referat: referatReducer,
    }),
    view: combineReducers({
        endreAktivitet: endreAktivitetReducer,
    }),
    feil: feilReducer,
});

export default function(state, action) {
    if (action.type === RESET_STORE.type) {
        return combinedReducers(undefined, action);
    }
    return combinedReducers(state, action);
}
