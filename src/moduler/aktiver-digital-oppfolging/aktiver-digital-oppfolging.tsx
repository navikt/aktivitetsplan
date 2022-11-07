import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { STATUS } from '../../api/utils';
import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/HiddenIfHovedknapp';
import { settDigital } from '../oppfolging-status/oppfolging-reducer';
import { selectOppfolgingStatus, selectReservasjonKRR } from '../oppfolging-status/oppfolging-selector';
import AktiverDigitalOppfolgingVarsel from './aktiver-digital-oppfolging-varsel';

function AktiverDigitalOppfolging() {
    const oppfolgingStatus = useSelector(selectOppfolgingStatus);
    const reservertKrr = useSelector(selectReservasjonKRR);
    const dispatch = useDispatch();

    const settOppfolgingFeilet = oppfolgingStatus === STATUS.ERROR;
    const lasterOppfolging = oppfolgingStatus === STATUS.PENDING || oppfolgingStatus === STATUS.RELOADING;

    return (
        <div className="sett-digital">
            <AktiverDigitalOppfolgingVarsel reservertIKRR={reservertKrr} settDigitalFeilet={settOppfolgingFeilet} />
            <HiddenIfHovedknapp
                disabled={lasterOppfolging}
                hidden={reservertKrr}
                onClick={() => dispatch(settDigital() as unknown as AnyAction)}
                autoDisableVedSpinner
            >
                <FormattedMessage id="sett-digital.manuell-oppfolging.aktiver-digital-knapp" />
            </HiddenIfHovedknapp>
        </div>
    );
}

export default AktiverDigitalOppfolging;
