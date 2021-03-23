import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { selectErBruker, selectIdentitetStatus } from '../identitet/identitet-selector';
import { selectOppfolgingStatus } from '../oppfolging-status/oppfolging-selector';
import BrukerVarslinger from './brukerVarsel';
import VeilederVarsel from './VeilederVarsel';

function Varslinger() {
    const oppfolgingstatus = useSelector(selectOppfolgingStatus, shallowEqual);
    const ident = useSelector(selectIdentitetStatus, shallowEqual);
    const erBruker = useSelector(selectErBruker);

    const child = erBruker ? <BrukerVarslinger /> : <VeilederVarsel />;

    return <Innholdslaster avhengigheter={[oppfolgingstatus, ident]}> {child}</Innholdslaster>;
}

export default Varslinger;
