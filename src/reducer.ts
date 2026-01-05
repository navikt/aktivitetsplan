import { combineReducers } from 'redux';

import dragAndDropSlice from './moduler/aktivitet/aktivitet-kort/dragAndDropSlice';
import aktiviteterReducer from './moduler/aktivitet/aktivitet-slice';
import aktivitetViewReducer from './moduler/aktivitet/aktivitetview-slice';
import arenaAktiviteterReducer from './moduler/aktivitet/arena-aktiviteter-slice';
import dialogReducer from './moduler/dialog/dialog-slice';
import featureReducer from './moduler/feature/feature-slice';
import errorReducer from './moduler/feilmelding/feil-slice';
import filterReducer from './moduler/filtrering/filter/filter-slice';
import identitetReducer from './moduler/identitet/identitet-slice';
import lestReducer from './moduler/lest/lest-slice';
import malReducer from './moduler/mal/aktivitetsmal-slice';
import malListeReducer from './moduler/mal/malliste-slice';
import oppfolgingReducer from './moduler/oppfolging-status/oppfolging-slice';
import eskaleringsvarselReducer from './moduler/varslinger/eskaleringsvarsel-slice';
import veilederReducer from './moduler/veileder/veileder-slice';
import { arkivReducer } from './moduler/verktoylinje/arkivering/arkiv-slice';
import { innsynsrettReducer } from './moduler/aktivitet/innsynsrett/innsynsrett-slice';
import valgtPeriodeReducer from './moduler/filtrering/filter/valgt-periode-slice';
import { tryggTekstReducer } from './moduler/aktivitet/aktivitet-forms/tryggtekst/tryggtekst-slice';

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
        arkiv: arkivReducer,
        lest: lestReducer,
        veileder: veilederReducer,
        eskaleringsvarsel: eskaleringsvarselReducer,
        feature: featureReducer,
        errors: errorReducer,
        innsynsrett: innsynsrettReducer,
        valgtPeriode: valgtPeriodeReducer,
        tryggTekst: tryggTekstReducer,
    }),
    view: combineReducers({
        visteAktiviteterMedEndringer: aktivitetViewReducer,
        dragAndDrop: dragAndDropSlice,
    }),
};

export default reducer;
