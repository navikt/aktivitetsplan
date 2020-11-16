import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import hiddenIfHOC from './hidden-if';

export const HiddenIfKnapp = hiddenIfHOC(Knapp);
export const HiddenIfHovedknapp = hiddenIfHOC(Hovedknapp);
