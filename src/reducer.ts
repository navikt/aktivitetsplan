import { combineReducers } from 'redux';

import authReducer from './felles-komponenter/timeoutbox/auth-slice';
import dragAndDropReducer from './moduler/aktivitet/aktivitet-kort/dragAndDropReducer';
import aktiviteterReducer from './moduler/aktivitet/aktivitet-reducer';
import versjonReducer from './moduler/aktivitet/aktivitet-versjoner/aktivitet-versjoner-reducer';
import aktivitetViewReducer from './moduler/aktivitet/aktivitetview-reducer';
import arenaAktiviteterReducer from './moduler/aktivitet/arena-aktiviteter-reducer';
import dialogReducer from './moduler/dialog/dialog-reducer';
import filterReducer from './moduler/filtrering/filter/filter-reducer';
import identitetReducer from './moduler/identitet/identitet-slice';
import informasjonReducer from './moduler/informasjon/informasjon-reducer';
import lestReducer from './moduler/lest/lest-slice';
import malReducer from './moduler/mal/aktivitetsmal-reducer';
import malListeReducer from './moduler/mal/malliste-reducer';
import malverkReducer from './moduler/malverk/malverk-reducer';
import oppfolgingReducer from './moduler/oppfolging-status/oppfolging-reducer';
import tilgangReducer from './moduler/tilgang/tilgang-slice';
import eskaleringsvarselReducer from './moduler/varslinger/eskaleringsvarsel-slice';
import veilederReducer from './moduler/veileder/veileder-slice';

const combinedReducers = combineReducers({
    data: combineReducers({
        aktiviteter: aktiviteterReducer,
        arenaAktiviteter: arenaAktiviteterReducer,
        dialog: dialogReducer,
        filter: filterReducer,
        identitet: identitetReducer,
        mal: malReducer,
        malListe: malListeReducer,
        oppfolging: oppfolgingReducer,
        tilgang: tilgangReducer,
        versjoner: versjonReducer,
        malverk: malverkReducer,
        lest: lestReducer,
        auth: authReducer,
        veileder: veilederReducer,
        eskaleringsvarsel: eskaleringsvarselReducer,
    }),
    view: combineReducers({
        visteAktiviteterMedEndringer: aktivitetViewReducer,
        informasjon: informasjonReducer,
        dragAndDrop: dragAndDropReducer,
    }),
});

export type State = Parameters<typeof combinedReducers>[0];
export type Action = Parameters<typeof combinedReducers>[1];

export default function reducer(state: State, action: Action) {
    return combinedReducers(state, action);
}
