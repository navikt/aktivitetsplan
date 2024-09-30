import { GuidePanel } from '@navikt/ds-react';
import { useSelector } from 'react-redux';
import { selectInnsynsrett } from './innsynsrett-selector';

export const InnsynsrettInfo = () => {
    const innsynsrett = useSelector(selectInnsynsrett);

    if (!innsynsrett || !innsynsrett.foresatteHarInnsynsrett) return null;

    return <GuidePanel poster={true}>Husk at dine foresatte kan lese det du skriver her.</GuidePanel>;
};
