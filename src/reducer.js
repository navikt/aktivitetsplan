import { combineReducers } from 'redux';
import aktiviteterReducer from './moduler/aktivitet/aktivitet-reducer';
import arenaAktiviteterReducer from './moduler/aktivitet/arena-aktiviteter-reducer';
import brukerReducer from './moduler/bruker/bruker-reducer';
import dialogReducer from './moduler/dialog/dialog-reducer';
import dialogViewReducer from './moduler/dialog/dialog-view-reducer';
import featureReducer from './ducks/feature-reducer';
import filterReducer from './moduler/filtrering/filter/filter-reducer';
import identitetReducer from './moduler/identitet/identitet-reducer';
import malListeReducer from './moduler/mal/malliste-reducer';
import malReducer from './moduler/mal/aktivitetsmal-reducer';
import oppfolgingReducer from './moduler/oppfolging-status/oppfolging-reducer';
import versjonReducer from './moduler/aktivitet/aktivitet-versjoner/aktivitet-versjoner-reducer';
import malverkReducer from './moduler/malverk/malverk-reducer';
import underelmenterReducer from './moduler/aktivitet/visning/underelement-for-aktivitet/underelementer-view-reducer';
import authReducer from './felles-komponenter/timeoutbox/auth-reducer';
import lestReducer from './moduler/lest/lest-reducer';
import aktivitetViewReducer from './moduler/aktivitet/aktivitetview-reducer';
import informasjonReducer from './moduler/informasjon/informasjon-reducer';

const combinedReducers = combineReducers({
    data: combineReducers({
        aktiviteter: aktiviteterReducer,
        arenaAktiviteter: arenaAktiviteterReducer,
        bruker: brukerReducer,
        dialog: dialogReducer,
        filter: filterReducer,
        identitet: identitetReducer,
        mal: malReducer,
        malListe: malListeReducer,
        oppfolging: oppfolgingReducer,
        versjoner: versjonReducer,
        feature: featureReducer,
        malverk: malverkReducer,
        lest: lestReducer,
        auth: authReducer
    }),
    view: combineReducers({
        dialog: dialogViewReducer,
        underelementer: underelmenterReducer,
        visteAktiviteterMedEndringer: aktivitetViewReducer,
        informasjon: informasjonReducer
    })
});

export default function(state, action) {
    return combinedReducers(state, action);
}
