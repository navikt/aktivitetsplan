import { addDays, differenceInDays, parseISO, startOfDay } from 'date-fns';
import React, { Suspense } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { ARBEIDSSOKERREGISTRERING_URL } from '../../constant';
import {
    selectErUnderOppfolging,
    selectInaktiveringsDato,
    selectKanReaktiveres,
} from '../oppfolging-status/oppfolging-selector';
import AdvarselMedDialogLenke from './AdvarselMedDialogLenke';
import AdvarselMedLenkeVarsling from './AdvarselMedLenkeVarsling';
import { Await, useRouteLoaderData } from 'react-router-dom';
import { InitialPageLoadResult } from '../../routing/loaders';

const infotekstTilInaktivertBrukere = (antallDagerIgjen?: number): string => {
    if (!antallDagerIgjen) {
        // oppfolging.inaktivert-mer-enn-28-dager.reaktiveres_nb.txt
        return 'Du er ikke lenger registrert hos Nav og din tidligere aktivitetsplan er lagt under "Tidligere plan". Hvis du fortsatt skal motta ytelser og få oppfølging fra Nav må du være registrert.';
    }

    const mellom10og28 = antallDagerIgjen <= 28 && antallDagerIgjen >= 10;
    const mindreEnn10 = antallDagerIgjen < 10 && antallDagerIgjen >= 1;

    if (mellom10og28) {
        // oppfolging.inaktivert-28-til-10-dager.reaktiveres_nb.txt
        return 'Du er ikke lenger registrert hos Nav. Hvis du fortsatt skal motta ytelser, få oppfølging fra Nav og bruke aktivitetsplanen må du være registrert.';
    }
    if (mindreEnn10) {
        // oppfolging.inaktivert-mindre-enn-10-dager.reaktiveres_nb.txt
        return `Du er ikke lenger registrert hos Nav. Hvis du fortsatt skal motta ytelser, få oppfølging fra Nav og bruke aktivitetsplanen må du være registrert. Om ${antallDagerIgjen} dager vil denne aktivitetsplanen bli avsluttet.`;
    }

    // oppfolging.inaktivert-mer-enn-28-dager.reaktiveres_nb.txt
    return 'Du er ikke lenger registrert hos Nav og din tidligere aktivitetsplan er lagt under "Tidligere plan". Hvis du fortsatt skal motta ytelser og få oppfølging fra Nav må du være registrert.';
};

interface Props {
    tilhorendeDialogId?: string;
    erEskalert: boolean;
}

const BrukerVarslinger = (props: Props) => {
    const { tilhorendeDialogId, erEskalert } = props;

    const inaktiveringsdato = useSelector(selectInaktiveringsDato, shallowEqual);
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const kanReaktiveres = useSelector(selectKanReaktiveres);

    const dagensDato = startOfDay(new Date());
    const antallDagerIgjen = inaktiveringsdato
        ? differenceInDays(addDays(parseISO(inaktiveringsdato), 28), dagensDato)
        : undefined;

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
                        hidden={!kanReaktiveres}
                        tekst={infotekstTilInaktivertBrukere(antallDagerIgjen)}
                        lenkeTekst="Gå til registrering"
                        href={ARBEIDSSOKERREGISTRERING_URL}
                    />
                    <AdvarselMedLenkeVarsling
                        hidden={underOppfolging}
                        tekst={
                            'Du er ikke lenger registrert hos Nav og din tidligere aktivitetsplan er lagt under "Tidligere planer". Hvis du fortsatt skal motta ytelser, få oppfølging fra Nav og bruke aktivitetsplanen må du være registrert.'
                        }
                        lenkeTekst="Register deg hos Nav"
                        href={ARBEIDSSOKERREGISTRERING_URL}
                    />
                </div>
            </Await>
        </Suspense>
    );
};

export default BrukerVarslinger;
