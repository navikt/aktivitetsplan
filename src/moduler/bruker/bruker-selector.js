const selectBrukerSlice = state => state.data.bruker;
const selectBruker = state => selectBrukerSlice(state).data;
export default selectBruker;
