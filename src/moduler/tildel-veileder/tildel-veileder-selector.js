import { STATUS } from '../../ducks/utils';

function selectTildelVeilederSlice(state) {
    return state.data.tildelVeileder;
}

export function selectTildelVeilederStatus(state) {
    const status = selectTildelVeilederSlice(state).status;

    if (status === STATUS.NOT_STARTED) {
        return STATUS.OK;
    }

    return status;
}

export default {};
