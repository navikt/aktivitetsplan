import { EKSEMPEL_FNR, EKSEMPEL_VEILEDER } from '../config';

export default {
    id: SBS ? EKSEMPEL_FNR : EKSEMPEL_VEILEDER,
    erVeileder: !SBS,
    erBruker: SBS,
};
