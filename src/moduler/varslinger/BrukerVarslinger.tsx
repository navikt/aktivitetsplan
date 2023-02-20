import moment from 'moment';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { arbeidssokerregistreringHref } from '../oppfolging-status/har-ikke-aktivitetsplan';
import {
    selectErUnderOppfolging,
    selectInaktiveringsDato,
    selectKanReaktiveres,
} from '../oppfolging-status/oppfolging-selector';
import AdvarselMedDialogLenke from './AdvarselMedDialogLenke';
import { HiddenIfAdvarselMedLenke } from './varsel-alertstriper';

const infotekstTilInaktivertBrukere = (antallDagerIgjen?: number): string | undefined => {
    if (!antallDagerIgjen) {
        return 'oppfolging.inaktivert-mer-enn-28-dager.reaktiveres';
    }

    const mellom10og28 = antallDagerIgjen <= 28 && antallDagerIgjen >= 10;
    const mindreEnn10 = antallDagerIgjen < 10 && antallDagerIgjen >= 1;

    if (mellom10og28) {
        return 'oppfolging.inaktivert-28-til-10-dager.reaktiveres';
    }
    if (mindreEnn10) {
        return 'oppfolging.inaktivert-mindre-enn-10-dager.reaktiveres';
    }
    return 'oppfolging.inaktivert-mer-enn-28-dager.reaktiveres';
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

    const dagensDato = moment();
    const dato28dagerEtterIserv = moment(inaktiveringsdato).add(28, 'day');
    const antallDagerIgjen = dato28dagerEtterIserv.diff(dagensDato, 'days');

    return (
        <div className="container">
            <AdvarselMedDialogLenke
                lenkeTekst="Les hva du må gjøre."
                tekst="Du har fått en viktig melding fra NAV."
                dialogId={tilhorendeDialogId}
                className="mb-5 mt-4"
                hidden={!erEskalert}
            />
            <HiddenIfAdvarselMedLenke
                hidden={!kanReaktiveres}
                tekstId={infotekstTilInaktivertBrukere(antallDagerIgjen)}
                className="mb-5 mt-4"
                lenkeTekstId="oppfolging.ikke-under-oppfolging.reaktiveres.lenke-tekst"
                href={arbeidssokerregistreringHref}
                values={{ antalldagerIgjen: antallDagerIgjen }}
            />
            <HiddenIfAdvarselMedLenke
                hidden={underOppfolging}
                tekstId="ikke.under.oppfolging.reaktivering"
                className="mb-5 mt-4"
                lenkeTekstId="ikke.under.oppfolging.reaktivering.lenke"
                href={arbeidssokerregistreringHref}
                values={{ antalldagerIgjen: antallDagerIgjen }}
            />
        </div>
    );
};

export default BrukerVarslinger;
