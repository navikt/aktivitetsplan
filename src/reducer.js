import { combineReducers } from 'redux';
import { reducer as formReducer } from 'react-redux-form-validation';
import ledetekstReducer from './ducks/ledetekster-ressurs';
import oppfolgingStatusReducer from './ducks/oppfolging-status';
import vilkarReducer from './ducks/vilkar';
import aktiviteterReducer from './ducks/aktiviteter';
import arenaAktiviteterReducer from './ducks/arena-aktiviteter';
import etiketterReducer from './ducks/etiketter';
import endringsloggReducer from './ducks/endringslogg';
import dialogReducer from './ducks/dialog';
import malReducer from './ducks/mal';
import identitetReducer from './ducks/identitet';
import endreAktivitetReducer from './ducks/endre-aktivitet';
import feilReducer from './ducks/feil';


export default combineReducers({
    form: formReducer,
    data: combineReducers({
        ledetekster: ledetekstReducer,
        oppfolgingStatus: oppfolgingStatusReducer,
        vilkar: vilkarReducer,
        aktiviteter: aktiviteterReducer,
        arenaAktiviteter: arenaAktiviteterReducer,
        etiketter: etiketterReducer,
        endringslogg: endringsloggReducer,
        dialog: dialogReducer,
        mal: malReducer,
        identitet: identitetReducer
    }),
    view: combineReducers({
        endreAktivitet: endreAktivitetReducer
    }),
    feil: feilReducer
});
