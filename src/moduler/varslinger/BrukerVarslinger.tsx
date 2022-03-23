import moment from 'moment';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useReduxDispatch } from '../../felles-komponenter/hooks/useReduxDispatch';
import { velgHistoriskPeriode } from '../filtrering/filter/filter-reducer';
import { arbeidssokerregistreringHref } from '../oppfolging-status/har-ikke-aktivitetsplan';
import {
    selectErUnderOppfolging,
    selectInaktiveringsDato,
    selectKanReaktiveres,
} from '../oppfolging-status/oppfolging-selector';
import { HiddenIfAdvarselMedLenke, HiddenIfVarslingMedLenke } from './varsel-alertstriper';
import styls from './Varslinger.module.less';

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

    const dispatch = useReduxDispatch();
    const doVelgNavarendePeriode = () => dispatch(velgHistoriskPeriode(null));
    const inaktiveringsdato = useSelector(selectInaktiveringsDato, shallowEqual);
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const kanReaktiveres = useSelector(selectKanReaktiveres);

    const dagensDato = moment();
    const dato28dagerEtterIserv = moment(inaktiveringsdato).add(28, 'day');
    const antallDagerIgjen = dato28dagerEtterIserv.diff(dagensDato, 'days');

    return (
        <div className="container">
            <HiddenIfVarslingMedLenke
                hidden={!erEskalert}
                tekstId="oppfolgning.bruker.bruker-er-eskalert"
                lenkeTekstId="oppfolgning.bruker.bruker-er-eskalert.lenke-tekst"
                href={`/dialog/${tilhorendeDialogId}`}
                className={styls.varsling}
                onClick={() => {
                    doVelgNavarendePeriode();
                }}
            />
            <HiddenIfAdvarselMedLenke
                hidden={!kanReaktiveres}
                tekstId={infotekstTilInaktivertBrukere(antallDagerIgjen)}
                className={styls.varsling}
                lenkeTekstId="oppfolging.ikke-under-oppfolging.reaktiveres.lenke-tekst"
                href={arbeidssokerregistreringHref}
                values={{ antalldagerIgjen: antallDagerIgjen }}
            />
            <HiddenIfAdvarselMedLenke
                hidden={underOppfolging}
                tekstId="ikke.under.oppfolging.reaktivering"
                className={styls.varsling}
                lenkeTekstId="ikke.under.oppfolging.reaktivering.lenke"
                href={arbeidssokerregistreringHref}
                values={{ antalldagerIgjen: antallDagerIgjen }}
            />
        </div>
    );
};

export default BrukerVarslinger;
