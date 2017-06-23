import { combineReducers } from 'redux';
import { reducer as formReducer } from 'react-redux-form-validation';
import ledetekstReducer from './ducks/ledetekster-ressurs';
import oppfolgingStatusReducer from './ducks/oppfolging-status';
import vilkarReducer from './ducks/vilkar';
import aktiviteterReducer from './ducks/aktiviteter';
import arenaAktiviteterReducer from './ducks/arena-aktiviteter';
import etiketterReducer from './ducks/etiketter';
import versjonReducer from './ducks/aktivitet-versjoner';
import dialogReducer from './ducks/dialog';
import malReducer from './ducks/mal';
import identitetReducer from './ducks/identitet';
import motpartReducer from './ducks/motpart';
import endreAktivitetReducer from './ducks/endre-aktivitet';
import feilReducer from './ducks/feil';
import historiskeVilkarReducer from './ducks/historiske-vilkar';
import filterReducer from './moduler/filter/filter-reducer';
import veilederReducer from './ducks/veileder';

export default combineReducers({
    form: formReducer,
    data: combineReducers({
        ledetekster: ledetekstReducer,
        oppfolgingStatus: oppfolgingStatusReducer,
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
    }),
    view: combineReducers({
        endreAktivitet: endreAktivitetReducer,
    }),
    feil: feilReducer,
});
