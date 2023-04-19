import { useSelector } from 'react-redux';

import { selectVeilederNavn } from '../../../veileder/veileder-selector';

export const useReferatStartTekst = () => {
    const veilederNavn = useSelector(selectVeilederNavn);

    if (!veilederNavn) {
        return '';
    }

    return `\nHilsen ${veilederNavn}`;
};
