import { Add, Print } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import loggEvent, { APNE_NY_AKTIVITET } from '../../felles-komponenter/utils/logging';
import { selectHarTilgangTilAktiviteter } from '../aktivitet/aktivitet-selector';
import Filter from '../filtrering/Filter';
import { selectFilterSlice, selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import PeriodeFilter from '../filtrering/filter/PeriodeFilter';
import VisValgtFilter from '../filtrering/VisValgtFilter';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';

const Verktoylinje = () => {
    const underOppfolging: boolean = useSelector(selectErUnderOppfolging);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang);
    const aktivitetLaster = useSelector(selectHarTilgangTilAktiviteter);

    const history = useHistory();
    const goToPrint = () => {
        history.push('/utskrift');
    };

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex gap-y-4 flex-col sm:gap-x-4 sm:flex-row">
                <div className="flex gap-y-4 flex-col sm:flex-row sm:gap-x-4">
                    {!viserHistoriskPeriode && underOppfolging && harSkriveTilgang ? (
                        <Link to="/aktivitet/ny">
                            <Button
                                className="w-full"
                                icon={<Add role="img" focusable="false" aria-hidden />}
                                disabled={!aktivitetLaster}
                                onClick={() => loggEvent(APNE_NY_AKTIVITET)}
                            >
                                Legg til aktivitet
                            </Button>
                        </Link>
                    ) : null}
                    <Filter />
                </div>
                <div className="flex">
                    <PeriodeFilter skjulInneverende={!underOppfolging} />
                    <Button variant="tertiary" icon={<Print />} onClick={goToPrint}>
                        Skriv ut
                    </Button>
                </div>
            </div>
            <VisValgtFilter />
        </div>
    );
};

export default Verktoylinje;
