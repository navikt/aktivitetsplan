import { Dialog, Eskaleringsvarsel, NyHenvendelse, SistOppdatert } from '../datatypes/dialogTypes';
import { DIALOG_BASE_URL } from '../environment';
import { fetchToJson, postAsJson, putAsJson } from './utils';

export const fetchDialoger = (): Promise<Dialog[]> => fetchToJson(`${DIALOG_BASE_URL}/dialog`);

export const fetchSistOppdatert = (): Promise<SistOppdatert> => fetchToJson(`${DIALOG_BASE_URL}/dialog/sistOppdatert`);

export const postNyHenvendelse = (henvendelse: NyHenvendelse): Promise<Dialog> =>
    postAsJson(`${DIALOG_BASE_URL}/dialog`, henvendelse);

export const postDialogLest = (dialogId: string): Promise<Dialog> =>
    putAsJson(`${DIALOG_BASE_URL}/dialog/${dialogId}/les`);

export const postForhandsorientering = (henvendelse: NyHenvendelse): Promise<Dialog> =>
    postAsJson(`${DIALOG_BASE_URL}/dialog/forhandsorientering`, henvendelse);

export const fetchEskaleringsvarsel = (): Promise<Eskaleringsvarsel> =>
    fetchToJson(`${DIALOG_BASE_URL}/eskaleringsvarsel/gjeldende`);
