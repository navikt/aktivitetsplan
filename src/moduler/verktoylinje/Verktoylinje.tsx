import React from 'react';

import Filter from '../filtrering/Filter';
import PeriodeFilter from '../filtrering/filter/PeriodeFilter';
import VisValgtFilter from '../filtrering/VisValgtFilter';
import LeggTilNyttAktivitetsKort from '../aktivitet/ny-aktivitet/LeggTilNyttAktivitetsKort';

const Verktoylinje = () => {
    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex gap-y-4 sm:flex-row flex-col-reverse ">
                <div className="flex gap-4 items-start flex-col sm:flex-row w-full">
                    <LeggTilNyttAktivitetsKort />
                    <Filter />
                </div>
                <PeriodeFilter />
            </div>
            <VisValgtFilter />
        </div>
    );
};

export default Verktoylinje;
