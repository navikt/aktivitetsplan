import { useSelector } from 'react-redux';

import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import visibleIfHOC from '../../../hocs/visible-if';
import { selectErBruker } from '../../identitet/identitet-selector';
import { delCvikkeSvartSkalVises } from '../aktivitet-util';
import { CustomAlertstripe } from '../visning/hjelpekomponenter/CustomAlertstripe';

export const SkalDelCvIkkeSvartVises = (aktivitet: Aktivitet): boolean => {
    const erBruker = useSelector(selectErBruker);
    const markeringSkalVises = delCvikkeSvartSkalVises(aktivitet);

    return erBruker && markeringSkalVises;
};

const DelCvIkkeSvart = () => {
    return <CustomAlertstripe tekst="Venter på svar fra deg" />;
};

export default visibleIfHOC(DelCvIkkeSvart);
