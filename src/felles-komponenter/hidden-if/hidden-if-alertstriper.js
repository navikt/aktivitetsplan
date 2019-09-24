import {
    AlertStripeAdvarsel,
    AlertStripeSuksess,
    AlertStripeSuksessSolid,
    AlertStripeInfoSolid,
    AlertStripeInfo
} from 'nav-frontend-alertstriper';
import hiddenIfHOC from './hidden-if';

export const HiddenIfAlertStripeSuksess = hiddenIfHOC(AlertStripeSuksess);
export const HiddenIfAlertStripeSuksessSolid = hiddenIfHOC(AlertStripeSuksessSolid);
export const HiddenIfAlertStripeAdvarsel = hiddenIfHOC(AlertStripeAdvarsel);
export const HiddenIfAlertStripeInfo = hiddenIfHOC(AlertStripeInfo);
export const HiddenIfAlertStripeInfoSolid = hiddenIfHOC(AlertStripeInfoSolid);
