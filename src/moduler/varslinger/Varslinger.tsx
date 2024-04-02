import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { selectErBruker } from '../identitet/identitet-selector';
import BrukerVarslinger from './BrukerVarslinger';
import { selectErEskalert, selectEskaleringsvarselData } from './eskaleringsvarsel-selector';
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
