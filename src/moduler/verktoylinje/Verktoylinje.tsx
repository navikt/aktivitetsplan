import { Add, Print } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import loggEvent, { APNE_NY_AKTIVITET } from '../../felles-komponenter/utils/logging';
import { selectHarTilgangTilAktiviteter } from '../aktivitet/aktivitet-selector';
import Filter from '../filtrering/Filter';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
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

    const leggTilAktivitetDisabled = viserHistoriskPeriode || !underOppfolging || !harSkriveTilgang;

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex gap-y-4 flex-col md:gap-x-4 md:flex-row">
                <div className="flex gap-4 items-start flex-col sm:flex-row md:gap-x-4">
                    <Button
                        icon={<Add role="img" focusable="false" aria-hidden />}
                        disabled={!aktivitetLaster || leggTilAktivitetDisabled}
                        onClick={() => {
                            loggEvent(APNE_NY_AKTIVITET);
                            history.push('/aktivitet/ny');
                        }}
                    >
                        Legg til aktivitet
                    </Button>
                    <Filter />
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
