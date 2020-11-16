import { fetchToJson, postAsJson, putAsJson } from '../../ducks/utils';
import { DIALOG_BASE_URL } from '../../environment';

export function hentDialog() {
    return fetchToJson(`${DIALOG_BASE_URL}/dialog`);
}

export function hentSistOppdatert() {
    return fetchToJson(`${DIALOG_BASE_URL}/dialog/sistOppdatert`);
}

export function nyHenvendelse(henvendelse) {
    return postAsJson(`${DIALOG_BASE_URL}/dialog`, henvendelse);
}

export function markerDialogSomLest(dialogId) {
    return putAsJson(`${DIALOG_BASE_URL}/dialog/${dialogId}/les`);
}

export function oppdaterFerdigbehandlet(dialogId, erFerdigbehandlet) {
    return putAsJson(`${DIALOG_BASE_URL}/dialog/${dialogId}/ferdigbehandlet/${erFerdigbehandlet}`);
}

export function oppdaterVenterPaSvar(dialogId, venterPaSvar) {
    return putAsJson(`${DIALOG_BASE_URL}/dialog/${dialogId}/venter_pa_svar/${venterPaSvar}`);
}

export function sendForhandsorientering(henvendelse) {
    return postAsJson(`${DIALOG_BASE_URL}/dialog/forhandsorientering`, henvendelse);
}
