import * as Api from './aktiver-digital-oppfolging-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, action } = createActionsAndReducer(
    'digital_oppfolging',
    'aktiverDigitalOppfolging',
    []
);

export default reducer;

export function settDigital() {
    return action(Api.settDigital);
}
