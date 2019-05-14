import { combineReducers } from 'redux';
import { reducer as formReducer } from 'react-redux-form-validation';
import aktiviteterReducer from './moduler/aktivitet/aktivitet-reducer';
import arenaAktiviteterReducer from './moduler/aktivitet/arena-aktiviteter-reducer';
import brukerReducer from './moduler/bruker/bruker-reducer';
import dialogReducer from './moduler/dialog/dialog-reducer';
import dialogViewReducer from './moduler/dialog/dialog-view-reducer';
import featureReducer from './ducks/feature-reducer';
import filterReducer from './moduler/filtrering/filter/filter-reducer';
import identitetReducer from './moduler/identitet/identitet-reducer';
import malListeReducer from './moduler/mal/malliste-reducer';
import fremtidigSituasjonReducer from '../src/hovedside/maal/fremtidigSituasjon-reducer';
import malReducer from './moduler/mal/aktivitetsmal-reducer';
import veilederePaEnhetReducer from './moduler/veiledere-pa-enhet/veiledere-pa-enhet-reducer';
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
import informasjonReducer from './moduler/informasjon/informasjon-reducer';

export const RESET_STORE = { type: 'store/reset' };

const combinedReducers = combineReducers({
    form: formReducer,
    data: combineReducers({
        aktiviteter: aktiviteterReducer,
        arenaAktiviteter: arenaAktiviteterReducer,
        bruker: brukerReducer,
        dialog: dialogReducer,
        filter: filterReducer,
        identitet: identitetReducer,
        mal: malReducer,
        fremtidigSituasjon: fremtidigSituasjonReducer,
        malListe: malListeReducer,
        oppfolging: oppfolgingReducer,
        oppfoelgingsstatus: oppfolgingstatusReducer,
        versjoner: versjonReducer,
        feature: featureReducer,
        veilederTilgang: veilederTilgangReducer,
        malverk: malverkReducer,
        veilederePaEnhet: veilederePaEnhetReducer,
        lest: lestReducer,
        auth: authReducer,
    }),
    view: combineReducers({
        dialog: dialogViewReducer,
        utskrift: utskriftReducer,
        underelementer: underelmenterReducer,
        visteAktiviteterMedEndringer: aktivitetViewReducer,
        informasjon: informasjonReducer,
    }),
});

export default function(state, action) {
    if (action.type === RESET_STORE.type) {
        return combinedReducers(undefined, action);
    }
    return combinedReducers(state, action);
}
