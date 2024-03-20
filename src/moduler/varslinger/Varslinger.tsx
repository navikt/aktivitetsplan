import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { selectErBruker, selectIdentitetStatus } from '../identitet/identitet-selector';
import { selectOppfolgingStatus } from '../oppfolging-status/oppfolging-selector';
import BrukerVarslinger from './BrukerVarslinger';
import {
    selectErEskalert,
    selectEskaleringsvarselData,
    selectEskaleringsvarselStatus,
} from './eskaleringsvarsel-selector';
import VeilederVarsel from './VeilederVarsel';

const Varslinger = () => {
    const erBruker = useSelector(selectErBruker);
    const eskaleringsvarsel = useSelector(selectEskaleringsvarselData, shallowEqual);
    const erEskalert = useSelector(selectErEskalert);

    return erBruker ? (
        <BrukerVarslinger tilhorendeDialogId={eskaleringsvarsel?.tilhorendeDialogId} erEskalert={erEskalert} />
    ) : (
        <VeilederVarsel
            tilhorendeDialogId={eskaleringsvarsel?.tilhorendeDialogId}
            opprettetDato={eskaleringsvarsel?.opprettetDato}
            erEskalert={erEskalert}
        />
    );
};

export default Varslinger;
