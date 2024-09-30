import { GuidePanel } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { hentInnsynsrett } from '../../../api/aktivitetAPI';
import { mockfnr } from '../../../mocks/utils';

export const Under18Info = () => {
    const [foresatteHarInnsynsRett, setForesatteHarInnsynsRett] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        console.log(mockfnr)
        console.log('foresatteHarInnsynsRett111111');
        console.log(hentInnsynsrett());
        hentInnsynsrett().then((innsynsrett) => {
                console.log('foresatteHarInnsynsRett');
                setForesatteHarInnsynsRett(innsynsrett.foresatteHarInnsynsrett);

            });

    }, []);
    if (!foresatteHarInnsynsRett) return null;

    return <GuidePanel poster={true}>Husk at dine foresatte kan lese det du skriver her.</GuidePanel>;
};
