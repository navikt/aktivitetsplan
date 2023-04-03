import React from 'react';
import { useSelector } from 'react-redux';

import { Status } from '../../createGenericSlice';
import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/HiddenIfHovedknapp';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { settDigital } from '../oppfolging-status/oppfolging-reducer';
import { selectOppfolgingStatus, selectReservasjonKRR } from '../oppfolging-status/oppfolging-selector';
import AktiverDigitalOppfolgingVarsel from './AktiverDigitalOppfolgingVarsel';

const AktiverDigitalOppfolging = () => {
    const oppfolgingStatus = useSelector(selectOppfolgingStatus);
    const reservertKrr = useSelector(selectReservasjonKRR);

    const settOppfolgingFeilet = oppfolgingStatus === Status.ERROR;
    const lasterOppfolging = oppfolgingStatus === Status.PENDING || oppfolgingStatus === Status.RELOADING;

    const dispatch = useAppDispatch();

    return (
        <div className="flex items-center flex-col">
            <AktiverDigitalOppfolgingVarsel reservertIKRR={reservertKrr} settDigitalFeilet={settOppfolgingFeilet} />
            <HiddenIfHovedknapp
                disabled={lasterOppfolging}
                hidden={reservertKrr}
                onClick={() => dispatch(settDigital())}
            >
                Endre til digital oppfølging
            </HiddenIfHovedknapp>
        </div>
    );
};

export default AktiverDigitalOppfolging;
