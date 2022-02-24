import * as Api from '../../api/veilederAPI';
import { createActionsAndReducer } from '../../felles-komponenter/utils/createActionsAndReducer';

const { reducer, cashedAction } = createActionsAndReducer('veileder');

export default reducer;

export const hentVeilederInfo = () => cashedAction(() => Api.fetchVeilederInfo());
