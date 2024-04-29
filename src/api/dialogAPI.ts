import { Dialog, Eskaleringsvarsel, SistOppdatert } from '../datatypes/dialogTypes';
import { DIALOG_BASE_URL } from '../environment';
import { fetchToJson } from './utils';

export const fetchDialoger = (): Promise<Dialog[]> => fetchToJson(`${DIALOG_BASE_URL}/dialog`);

export const fetchSistOppdatert = (): Promise<SistOppdatert> => fetchToJson(`${DIALOG_BASE_URL}/dialog/sistOppdatert`);

export const fetchEskaleringsvarsel = (): Promise<Eskaleringsvarsel> =>
    fetchToJson(`${DIALOG_BASE_URL}/eskaleringsvarsel/gjeldende`);
