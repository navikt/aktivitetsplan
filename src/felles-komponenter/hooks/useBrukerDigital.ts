import { useSelector } from 'react-redux';

import { selectErBrukerManuell, selectReservasjonKRR } from '../../moduler/oppfolging-status/oppfolging-selector';

export const useErBrukerDigital = () => {
    const erManuell = useSelector(selectErBrukerManuell);
    const erReservertKRR = useSelector(selectReservasjonKRR);

    return !(erManuell || erReservertKRR);
};
