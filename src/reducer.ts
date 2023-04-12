import { combineReducers } from 'redux';

import authReducer from './felles-komponenter/timeoutbox/auth-slice';
import dragAndDropSlice from './moduler/aktivitet/aktivitet-kort/dragAndDropSlice';
import aktiviteterReducer from './moduler/aktivitet/aktivitet-slice';
import versjonReducer from './moduler/aktivitet/aktivitet-versjoner/aktivitet-versjoner-slice';
import aktivitetViewReducer from './moduler/aktivitet/aktivitetview-slice';
import arenaAktiviteterReducer from './moduler/aktivitet/arena-aktiviteter-slice';
import dialogReducer from './moduler/dialog/dialog-slice';
import filterReducer from './moduler/filtrering/filter/filter-slice';
import identitetReducer from './moduler/identitet/identitet-slice';
import lestReducer from './moduler/lest/lest-slice';
import malReducer from './moduler/mal/aktivitetsmal-slice';
import malListeReducer from './moduler/mal/malliste-slice';
import malverkReducer from './moduler/malverk/malverk-slice';
import oppfolgingReducer from './moduler/oppfolging-status/oppfolging-slice';
import tilgangReducer from './moduler/tilgang/tilgang-slice';
import eskaleringsvarselReducer from './moduler/varslinger/eskaleringsvarsel-slice';
import veilederReducer from './moduler/veileder/veileder-slice';

const reducer = {
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
        dragAndDrop: dragAndDropSlice,
    }),
};

export default reducer;
