import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { STATUS } from '../../api/utils';
import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/HiddenIfHovedknapp';
import { settDigital } from '../oppfolging-status/oppfolging-reducer';
import { selectOppfolgingStatus, selectReservasjonKRR } from '../oppfolging-status/oppfolging-selector';
import AktiverDigitalOppfolgingVarsel from './AktiverDigitalOppfolgingVarsel';

const AktiverDigitalOppfolging = () => {
    const oppfolgingStatus = useSelector(selectOppfolgingStatus);
    const reservertKrr = useSelector(selectReservasjonKRR);

    const settOppfolgingFeilet = oppfolgingStatus === STATUS.ERROR;
    const lasterOppfolging = oppfolgingStatus === STATUS.PENDING || oppfolgingStatus === STATUS.RELOADING;

    const dispatch = useDispatch();

    return (
        <div className="flex items-center flex-col">
            <AktiverDigitalOppfolgingVarsel reservertIKRR={reservertKrr} settDigitalFeilet={settOppfolgingFeilet} />
            <HiddenIfHovedknapp
                disabled={lasterOppfolging}
                hidden={reservertKrr}
                onClick={() => dispatch(settDigital() as unknown as AnyAction)}
            >
                Endre til digital oppfølging
            </HiddenIfHovedknapp>
        </div>
    );
};

export default AktiverDigitalOppfolging;
