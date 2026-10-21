import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { REGISTRERINGSINFORMASJON_URL } from '../../constant';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import AdvarselMedDialogLenke from './AdvarselMedDialogLenke';
import AdvarselMedLenkeVarsling from './AdvarselMedLenkeVarsling';
import { Await, useRouteLoaderData } from 'react-router';
import { InitialPageLoadResult } from '../../routing/loaders';

interface Props {
    tilhorendeDialogId?: string;
    erEskalert: boolean;
}

const BrukerVarslinger = (props: Props) => {
    const { tilhorendeDialogId, erEskalert } = props;
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const { oppfolging } = useRouteLoaderData('root') as InitialPageLoadResult;

    return (
        <Suspense fallback={null}>
            <Await resolve={oppfolging}>
                <div className="container">
                    <AdvarselMedDialogLenke
                        lenkeTekst="Les hva du må gjøre."
                        tekst="Du har fått en viktig melding fra Nav."
                        dialogId={tilhorendeDialogId}
                        hidden={!erEskalert}
                    />
                    <AdvarselMedLenkeVarsling
                        hidden={underOppfolging}
                        tekst={
                            'Du er ikke lenger registrert hos Nav og din tidligere aktivitetsplan er lagt under "Tidligere planer". Hvis du fortsatt skal motta ytelser og/eller få oppfølging fra Nav og bruke aktivitetsplanen må du være registrert.'
                        }
                        lenkeTekst="Registrer deg hos Nav"
                        href={REGISTRERINGSINFORMASJON_URL}
                    />
                </div>
            </Await>
        </Suspense>
    );
};

export default BrukerVarslinger;
