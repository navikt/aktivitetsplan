import {
    AlertStripeAdvarsel,
    AlertStripeSuksess,
    AlertStripeInfoSolid,
} from 'nav-frontend-alertstriper';
import hiddenIfHOC from './hidden-if';

export const HiddenIfAlertStripeSuksess = hiddenIfHOC(AlertStripeSuksess);
export const HiddenIfAlertStripeAdvarsel = hiddenIfHOC(AlertStripeAdvarsel);
export const HiddenIfAlertStripeInfoSolid = hiddenIfHOC(AlertStripeInfoSolid);
