import React from 'react';
import { useSelector } from 'react-redux';

import { Status } from '../../store/createGenericSlice';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { selectOppfolgingStatus, selectReservasjonKRR } from '../oppfolging-status/oppfolging-selector';
import { settDigital } from '../oppfolging-status/oppfolging-slice';
import AktiverDigitalOppfolgingVarsel from './AktiverDigitalOppfolgingVarsel';
import { Button } from '@navikt/ds-react';

const AktiverDigitalOppfolging = () => {
    const oppfolgingStatus = useSelector(selectOppfolgingStatus);
    const reservertKrr = useSelector(selectReservasjonKRR) || false;

    const settOppfolgingFeilet = oppfolgingStatus === Status.ERROR;
    const lasterOppfolging = oppfolgingStatus === Status.PENDING || oppfolgingStatus === Status.RELOADING;

    const dispatch = useAppDispatch();

    return (
        <div className="flex items-center flex-col">
            <AktiverDigitalOppfolgingVarsel
                reservertIKRR={reservertKrr || false}
                settDigitalFeilet={settOppfolgingFeilet}
            />
            {!reservertKrr ? (
                <Button loading={lasterOppfolging} disabled={lasterOppfolging} onClick={() => dispatch(settDigital())}>
                    Endre til digital oppfølging
                </Button>
            ) : null}
        </div>
    );
};

export default AktiverDigitalOppfolging;
