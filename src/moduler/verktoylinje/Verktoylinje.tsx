import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import loggEvent, { APNE_NY_AKTIVITET } from '../../felles-komponenter/utils/logging';
import { useRoutes } from '../../routing/useRoutes';
import { selectAktivitetStatus } from '../aktivitet/aktivitet-selector';
import Filter from '../filtrering/Filter';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import PeriodeFilter from '../filtrering/filter/PeriodeFilter';
import VisValgtFilter from '../filtrering/VisValgtFilter';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { Status } from '../../createGenericSlice';

const Verktoylinje = () => {
    const underOppfolging: boolean = useSelector(selectErUnderOppfolging);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode);
    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const navigate = useNavigate();
    const { nyAktivitetRoute } = useRoutes();

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex gap-y-4 sm:flex-row flex-col-reverse ">
                <div className="flex gap-4 items-start flex-col sm:flex-row w-full">
                    <Button
                        loading={[Status.RELOADING, Status.PENDING].includes(aktivitetStatus)}
                        className="self-stretch sm:self-auto"
                        icon={<PlusIcon role="img" aria-hidden fontSize="1.5rem" />}
                        disabled={viserHistoriskPeriode || aktivitetStatus === Status.ERROR}
                        onClick={() => {
                            loggEvent(APNE_NY_AKTIVITET);
                            navigate(nyAktivitetRoute());
                        }}
                    >
                        Legg til aktivitet
                    </Button>
                    <Filter />
                </div>
                <PeriodeFilter skjulInneverende={!underOppfolging} />
            </div>
            <VisValgtFilter />
        </div>
    );
};

export default Verktoylinje;
