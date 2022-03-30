import * as Api from '../../api/dialogAPI';
import { createActionsAndReducer } from '../../felles-komponenter/utils/createActionsAndReducer';

const { reducer, cashedAction } = createActionsAndReducer('eskaleringsvarsel');

export default reducer;

export const hentEskaleringsvarsel = () => cashedAction(() => Api.fetchEskaleringsvarsel());
