import { addMinutes } from 'date-fns';

import { AuthInfoResponse } from '../../datatypes/types';

export const auth: AuthInfoResponse = {
    expirationTime: addMinutes(new Date(), 10).toISOString(),
    loggedIn: true,
    remainingSeconds: 99999, // Dette blir ikke brukt, vi ser på expirationTime
    securityLevel: 'Level4',
};
