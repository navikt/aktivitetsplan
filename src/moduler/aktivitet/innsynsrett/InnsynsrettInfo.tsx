import { GuidePanel } from '@navikt/ds-react';
import { useSelector } from 'react-redux';
import { selectInnsynsrett } from './innsynsrett-selector';
import { innsynsrettInfoSkalVises } from './innsynsrett-slice';

export const InnsynsrettInfo = () => {
    const innsynsrett = useSelector(selectInnsynsrett);

    if (!innsynsrettInfoSkalVises) return null;
    if (!innsynsrett || !innsynsrett.foresatteHarInnsynsrett) return null;

    return (
        <GuidePanel className="guidepanel-innsynsrett" poster={true}>
            Husk at dine foresatte kan lese det du skriver her.
        </GuidePanel>
    );
};
