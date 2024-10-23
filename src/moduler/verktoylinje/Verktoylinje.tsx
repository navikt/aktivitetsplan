import React from 'react';
import { useSelector } from 'react-redux';

import Filter from '../filtrering/Filter';
import PeriodeFilter from '../filtrering/filter/PeriodeFilter';
import VisValgtFilter from '../filtrering/VisValgtFilter';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import LeggTilNyAktivitetsKort from '../aktivitet/ny-aktivitet/leggTilNyAktivitetsKort';

const Verktoylinje = () => {
    const underOppfolging: boolean = useSelector(selectErUnderOppfolging);

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex gap-y-4 sm:flex-row flex-col-reverse ">
                <div className="flex gap-4 items-start flex-col sm:flex-row w-full">
                    <LeggTilNyAktivitetsKort />
                    <Filter />
                </div>
                <PeriodeFilter skjulInneverende={!underOppfolging} />
            </div>
            <VisValgtFilter />
        </div>
    );
};

export default Verktoylinje;
