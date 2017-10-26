import * as Api from '../situasjon/situasjon-api';
import { STATUS } from '../../ducks/utils';
import { createActionsAndReducer } from '../../ducks/rest-reducer';
import { selectIdentitetStatus } from './identitet-selector';

const { reducer, action } = createActionsAndReducer('identitet');

export default reducer;

export function hentIdentitet() {
    return (dispatch, getState) => {
        const status = selectIdentitetStatus(getState());
        if (status === STATUS.NOT_STARTED || status === STATUS.ERROR) {
            action(() => Api.hentIdentitet())(dispatch);
        }
    };
}
