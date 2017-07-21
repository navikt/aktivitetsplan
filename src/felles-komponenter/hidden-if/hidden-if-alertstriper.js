import {
    AlertStripeAdvarsel,
    AlertStripeSuksess,
    AlertStripeSuksessSolid,
    AlertStripeInfoSolid,
} from 'nav-frontend-alertstriper';
import hiddenIfHOC from './hidden-if';

export const HiddenIfAlertStripeSuksess = hiddenIfHOC(AlertStripeSuksess);
export const HiddenIfAlertStripeSuksessSolid = hiddenIfHOC(
    AlertStripeSuksessSolid
);
export const HiddenIfAlertStripeAdvarsel = hiddenIfHOC(AlertStripeAdvarsel);
export const HiddenIfAlertStripeInfoSolid = hiddenIfHOC(AlertStripeInfoSolid);
