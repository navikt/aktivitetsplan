import { Add } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import InternLenke from '../../felles-komponenter/utils/InternLenke';
import loggEvent, { APNE_NY_AKTIVITET, APNE_OM_TJENESTEN } from '../../felles-komponenter/utils/logging';
import { selectHarTilgangTilAktiviteter } from '../aktivitet/aktivitet-selector';
import Filter from '../filtrering/filter';
import VisValgtFilter from '../filtrering/filter-vis-label';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import PeriodeFilter from '../filtrering/filter/periode-filter';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';

const Verktoylinje = () => {
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang);
    const aktivitetLaster = useSelector(selectHarTilgangTilAktiviteter);

    return (
        <div className="verktoylinje">
            <div className="verktoylinje__verktoy-container">
                <div />
                {!viserHistoriskPeriode && underOppfolging && harSkriveTilgang ? (
                    <Link to="/aktivitet/ny">
                        <Button
                            icon={<Add role="img" focusable="false" aria-hidden />}
                            disabled={!aktivitetLaster}
                            onClick={() => loggEvent(APNE_NY_AKTIVITET)}
                        >
                            Legg til aktivitet
                        </Button>
                    </Link>
                ) : null}
            </div>
            <div className="verktoylinje__verktoy-container">
                <div className="indre">
                    <InternLenke
                        href="/informasjon"
                        className="knappelenke"
                        onClick={() => loggEvent(APNE_OM_TJENESTEN)}
                    >
                        <span>Om aktivitetsplanen</span>
                    </InternLenke>
                    <InternLenke href="/utskrift" className="knappelenke utskrift-lenke">
                        <span>Skriv ut</span>
                    </InternLenke>
                    <Filter className="verktoylinje__verktoy" />
                </div>
            </div>
            <div className="verktoylinje__verktoy-container">
                <VisValgtFilter />
            </div>
            <div className="verktoylinje__verktoy-container">
                <PeriodeFilter className="verktoylinje__verktoy" skjulInneverende={!underOppfolging} />
            </div>
        </div>
    );
};

export default Verktoylinje;
