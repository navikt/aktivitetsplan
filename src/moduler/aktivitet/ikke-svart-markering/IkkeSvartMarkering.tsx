import { useSelector } from 'react-redux';

import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import visibleIfHOC from '../../../hocs/visible-if';
import { selectErBruker } from '../../identitet/identitet-selector';
import { ikkeSvartMarkeringSkalVises } from '../aktivitet-util';
import { CustomAlertstripe } from '../visning/hjelpekomponenter/CustomAlertstripe';

export const SkalIkkeSvartMarkeringVises = (aktivitet: Aktivitet): boolean => {
    const erBruker = useSelector(selectErBruker);
    const markeringSkalVises = ikkeSvartMarkeringSkalVises(aktivitet);

    return erBruker && markeringSkalVises;
};

const IkkeSvartMarkering = () => {
    return <CustomAlertstripe tekst="Venter på svar fra deg" />;
};

export default visibleIfHOC(IkkeSvartMarkering);
