import { createAsyncThunk } from '@reduxjs/toolkit';

import { fetchPersonNavn, PersonNavn } from '../../api/personAPI';
import { hentFraSessionStorage, LocalStorageElement } from '../../mocks/demo/localStorage';
import createGenericSlice from '../../store/createGenericSlice';

const personSlice = createGenericSlice<PersonNavn>({
    name: 'person',
    reducers: {},
});

export const hentPersonNavn = createAsyncThunk(`${personSlice.name}/fetchPersonNavn`, async () => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR);
    if (!fnr) throw new Error('Mangler brukerident for navneoppslag');
    return fetchPersonNavn(fnr);
});

export default personSlice.reducer;
