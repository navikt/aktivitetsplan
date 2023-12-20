import { Dialog, Eskaleringsvarsel, SistOppdatert } from '../datatypes/dialogTypes';
import { DIALOG_BASE_URL } from '../environment';
import { fetchToJson } from './utils';

export const fetchDialoger = (fnr: string | undefined): Promise<Dialog[]> =>
    fetchToJson(fnr, `${DIALOG_BASE_URL}/dialog`);

export const fetchSistOppdatert = (fnr: string | undefined): Promise<SistOppdatert> =>
    fetchToJson(fnr, `${DIALOG_BASE_URL}/dialog/sistOppdatert`);

export const fetchEskaleringsvarsel = (fnr: string | undefined): Promise<Eskaleringsvarsel> =>
    fetchToJson(fnr, `${DIALOG_BASE_URL}/eskaleringsvarsel/gjeldende`);
