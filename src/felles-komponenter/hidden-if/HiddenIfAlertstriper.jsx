import { AlertStripeInfo, AlertStripeSuksess } from 'nav-frontend-alertstriper';

import hiddenIfHOC from './HiddenIf';

export const HiddenIfAlertStripeSuksess = hiddenIfHOC(AlertStripeSuksess);

export const HiddenIfAlertStripeInfoSolid = hiddenIfHOC(AlertStripeInfo);
