import { STATUS } from '../../ducks/utils';

// eslint-disable-next-line import/prefer-default-export
export const selectAlleFeilmeldinger = state => {
    const data = state.data;
    return Object.keys(data)
        .filter(key => data[key].status === STATUS.ERROR)
        .map(key => data[key].feil)
        .filter(x => x);
};
