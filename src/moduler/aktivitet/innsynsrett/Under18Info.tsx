import { GuidePanel } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

export const Under18Info = () => {
    const [foresatteHarInnsynsRett, setForesatteHarInnsynsRett] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        //todo gjør api kall for å hente informasjon om bruker er under 18
    }, []);
    if (!foresatteHarInnsynsRett) return null;

    return <GuidePanel poster={true}>Husk at dine foresatte kan lese det du skriver her.</GuidePanel>;
};
