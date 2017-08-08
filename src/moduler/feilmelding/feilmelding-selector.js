// eslint-disable-next-line import/prefer-default-export
export const selectAlleFeilmeldinger = state => {
    const data = state.data;
    return Object.keys(data).map(slice => data[slice].feil).filter(x => x);
};
