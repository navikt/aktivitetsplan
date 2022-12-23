import * as Api from '../../api/oppfolgingAPI';
import { createActionsAndReducer } from '../../felles-komponenter/utils/createActionsAndReducer';

const { reducer, cashedAction } = createActionsAndReducer('identitet');

export default reducer;

export function hentIdentitet() {
    return cashedAction(() => Api.fetchIdentitet());
}
