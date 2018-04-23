import { EKSEMPEL_FNR, EKSEMPEL_VEILEDER } from '../config';

export default {
    id: INTERNFLATE ? EKSEMPEL_VEILEDER : EKSEMPEL_FNR,
    erVeileder: INTERNFLATE,
    erBruker: !INTERNFLATE,
};
