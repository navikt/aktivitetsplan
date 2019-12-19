import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { hentIdentitet } from '../identitet/identitet-reducer';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectOppfolgingStatus } from '../oppfolging-status/oppfolging-selector';
import { selectErBruker, selectIdentitetStatus } from '../identitet/identitet-selector';
import { hentOppfolging } from '../oppfolging-status/oppfolging-reducer';
import { useReduxDispatch } from '../../felles-komponenter/hooks/useReduxDispatch';
import BrukerVarslinger from './brukerVarsel';
import VeilederVarsel from './veilederVarsel';

function Varslinger() {
    const dispatch = useReduxDispatch();
    const oppfolgingstatus = useSelector(selectOppfolgingStatus, shallowEqual);
    const ident = useSelector(selectIdentitetStatus, shallowEqual);
    const erBruker = useSelector(selectErBruker);

    useEffect(() => {
        dispatch(hentIdentitet());
        dispatch(hentOppfolging());
    }, []);

    const child = erBruker ? <BrukerVarslinger /> : <VeilederVarsel />;

    return <Innholdslaster avhengigheter={[oppfolgingstatus, ident]}> {child}</Innholdslaster>;
}

export default Varslinger;
