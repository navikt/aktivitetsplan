import { STATUS } from '../../ducks/utils';
import * as Api from './aktivitet-api';
import { selectKanalerStatus } from './kanaler-selector';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, action } = createActionsAndReducer('kanal', []);

export default reducer;

export function hentKanaler() {
    return (dispatch, getState) => {
        const status = selectKanalerStatus(getState());
        if (status === STATUS.NOT_STARTED || status === STATUS.ERROR) {
            action(() => Api.hentKanaler());
        }
    };
}
