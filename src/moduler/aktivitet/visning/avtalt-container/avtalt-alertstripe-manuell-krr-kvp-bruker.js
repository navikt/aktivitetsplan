import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';
import visibleIfHOC from '../../../../hocs/visible-if';

function AvtaltStripeKRRKvpManuellBruker() {
    const brukerUtenAktivitesPlan = {
        brukerErManuell: useSelector(selectErBrukerManuell, shallowEqual),
        brukerErUnderKvp: useSelector(selectErUnderKvp, shallowEqual),
        brukerErIReservasjonKRR: useSelector(selectReservasjonKRR, shallowEqual),
    };

    const brukerUtenAktivitetsPlanSelectValue = Object.entries(brukerUtenAktivitesPlan).find(
        ([key, value]) => value
    )[0];
    return (
        <div>
            <AlertStripeInfo>
                <FormattedMessage
                    id="sett-avtalt-forhandsrientering-bruker-uten-aktivitesplan"
                    values={{
                        brukerUtenAktivitesplan: brukerUtenAktivitetsPlanSelectValue,
                    }}
                />
            </AlertStripeInfo>
        </div>
    );
}

export default visibleIfHOC(AvtaltStripeKRRKvpManuellBruker);
