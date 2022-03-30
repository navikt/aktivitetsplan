import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { selectErBruker, selectIdentitetStatus } from '../identitet/identitet-selector';
import {
    selectErEskalert as selectGammelErEskalert,
    selectGjeldendeEskaleringsVarsel,
    selectOppfolgingStatus,
} from '../oppfolging-status/oppfolging-selector';
import BrukerVarslinger from './BrukerVarslinger';
import {
    selectErEskalert,
    selectEskaleringsvarselData,
    selectEskaleringsvarselStatus,
} from './eskaleringsvarselSelector';
import VeilederVarsel from './VeilederVarsel';

const Varslinger = () => {
    const ident = useSelector(selectIdentitetStatus, shallowEqual);
    const erBruker = useSelector(selectErBruker);

    const eskaleringsvarselStatus = useSelector(selectEskaleringsvarselStatus, shallowEqual);
    const nyEskaleringsvarsel = useSelector(selectEskaleringsvarselData, shallowEqual);
    const nyErEskalert = useSelector(selectErEskalert);

    const oppfolgingstatus = useSelector(selectOppfolgingStatus, shallowEqual);
    const gammelEskaleringsvarsel = useSelector(selectGjeldendeEskaleringsVarsel, shallowEqual);
    const gammelErEskalert = useSelector(selectGammelErEskalert);

    const eskaleringsvarsel = nyErEskalert ? nyEskaleringsvarsel : gammelEskaleringsvarsel;
    const erEskalert = nyErEskalert || gammelErEskalert;

    const child = erBruker ? (
        <BrukerVarslinger tilhorendeDialogId={eskaleringsvarsel?.tilhorendeDialogId} erEskalert={erEskalert} />
    ) : (
        <VeilederVarsel
            tilhorendeDialogId={eskaleringsvarsel?.tilhorendeDialogId}
            opprettetDato={eskaleringsvarsel?.opprettetDato}
            erEskalert={erEskalert}
        />
    );

    return <Innholdslaster avhengigheter={[oppfolgingstatus, ident, eskaleringsvarselStatus]}> {child}</Innholdslaster>;
};

export default Varslinger;
