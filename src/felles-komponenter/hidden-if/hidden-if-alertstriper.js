import {
    AlertStripeAdvarsel,
    AlertStripeSuksess,
} from 'nav-frontend-alertstriper';
import hiddenIfHOC from './hidden-if';

export const HiddenIfAlertStripeSuksess = hiddenIfHOC(AlertStripeSuksess);
export const HiddenIfAlertStripeAdvarsel = hiddenIfHOC(AlertStripeAdvarsel);
