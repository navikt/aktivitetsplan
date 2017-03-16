import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import ledetekstReducer from './ducks/ledetekster-ressurs';
import oppfølgingStatusReducer from './ducks/oppfolging-status';
import vilkarReducer from './ducks/vilkar';
import aktiviteterReducer from './ducks/aktiviteter';
import etiketterReducer from './ducks/etiketter';
import endringsloggReducer from './ducks/endringslogg';


export default combineReducers({
    form: formReducer,
    data: combineReducers({
        ledetekster: ledetekstReducer,
        oppfolgingStatus: oppfølgingStatusReducer,
        vilkar: vilkarReducer,
        aktiviteter: aktiviteterReducer,
        etiketter: etiketterReducer,
        endringslogg: endringsloggReducer
    })
});
