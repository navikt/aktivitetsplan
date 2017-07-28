import { hentIdentitetReducer } from '../identitet/identitet-selector';

export const hentSituasjonReducer = state => state.data.situasjon;
export const brukerTilhorerVeileder = state =>
    hentSituasjonReducer(state).data.veilederId ===
    hentIdentitetReducer(state).data.id;
