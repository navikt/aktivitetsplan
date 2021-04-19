import { useSelector } from 'react-redux';

import { selectErBrukerManuell, selectReservasjonKRR } from '../../moduler/oppfolging-status/oppfolging-selector';
import { selectNivaa4 } from '../../moduler/tilgang/tilgang-selector';

export const useErBrukerDigital = () => {
    const erManuell = useSelector(selectErBrukerManuell);
    const erReservertKRR = useSelector(selectReservasjonKRR);
    const harNivaa4 = useSelector(selectNivaa4);

    return !(erManuell || erReservertKRR || !harNivaa4);
};
