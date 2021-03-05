import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import { useSelector } from 'react-redux';

import { STATUS } from '../../../api/utils';
import { selectErUnderOppfolging } from '../../oppfolging-status/oppfolging-selector';
import { selectAktivitetStatus } from '../aktivitet-selector';

export default function LagreAktivitet() {
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const status = useSelector(selectAktivitetStatus);
    const venter = !(status === STATUS.OK || status === STATUS.ERROR);

    return (
        <div className="aktivitetskjema__lagre-knapp">
            <Hovedknapp spinner={venter} disabled={venter || !underOppfolging}>
                Lagre
            </Hovedknapp>
        </div>
    );
}
