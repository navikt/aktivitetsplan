import { SistOppdatert } from '../datatypes/dialogTypes';
import { DIALOG_BASE_URL } from '../environment';
import { postAsJson } from './utils';
import { hentFraSessionStorage, LocalStorageElement } from '../mocks/demo/localStorage';

export const fetchSistOppdatert = (): Promise<SistOppdatert> => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR);
    return postAsJson(`${DIALOG_BASE_URL}/dialog/sistOppdatert`, { fnr });
};
