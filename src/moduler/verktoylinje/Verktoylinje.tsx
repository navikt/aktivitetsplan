import { PlusIcon } from '@navikt/aksel-icons';
import { Button, Dropdown} from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useRoutes } from '../../routing/useRoutes';
import { selectAktivitetStatus } from '../aktivitet/aktivitet-selector';
import Filter from '../filtrering/Filter';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import PeriodeFilter from '../filtrering/filter/PeriodeFilter';
import VisValgtFilter from '../filtrering/VisValgtFilter';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { Status } from '../../createGenericSlice';
import { useErVeileder } from '../../Provider';

const Verktoylinje = () => {
    const underOppfolging: boolean = useSelector(selectErUnderOppfolging);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode);
    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const { nyAktivitetRoute } = useRoutes();
    const nyAktivitetBasePath = nyAktivitetRoute();

    const erVeileder = useErVeileder();

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex gap-y-4 sm:flex-row flex-col-reverse ">
                <div className="flex gap-4 items-start flex-col sm:flex-row w-full">
                    <div className="min-h-32">
                        <Dropdown>
                            <Button
                                as={Dropdown.Toggle}
                                loading={[Status.RELOADING, Status.PENDING].includes(aktivitetStatus)}
                                className="self-stretch sm:self-auto"
                                icon={<PlusIcon role="img" aria-hidden fontSize="1.5rem" />}
                                disabled={viserHistoriskPeriode || aktivitetStatus === Status.ERROR}>
                                Legg til aktivitet
                            </Button>
                            <Dropdown.Menu>
                                {erVeileder ? (
                                    <div className="">
                                        <Dropdown.Menu.GroupedList.Heading>
                                            For NAV-ansatt
                                        </Dropdown.Menu.GroupedList.Heading>
                                        <Dropdown.Menu.GroupedList>
                                                <Dropdown.Menu.GroupedList.Item as={Link} to={`${nyAktivitetBasePath}/sokeavtale`}>Avtale om å søke jobber</Dropdown.Menu.GroupedList.Item>
                                                <Dropdown.Menu.GroupedList.Item as={Link} to={`${nyAktivitetBasePath}/mote`}>Møte med NAV</Dropdown.Menu.GroupedList.Item>
                                                <Dropdown.Menu.GroupedList.Item as={Link} to={`${nyAktivitetBasePath}/samtalereferat`}>Samtalereferat</Dropdown.Menu.GroupedList.Item>
                                        </Dropdown.Menu.GroupedList>
                                        <Dropdown.Menu.Divider />
                                    </div>
                                ) : null}

                                <Dropdown.Menu.GroupedList>
                                {erVeileder ? (
                                    <Dropdown.Menu.GroupedList.Heading>
                                        For bruker og NAV-ansatt
                                    </Dropdown.Menu.GroupedList.Heading>
                                ) :<Dropdown.Menu.GroupedList.Heading>
                                    Velg type aktivitet
                                </Dropdown.Menu.GroupedList.Heading> }
                                    <Dropdown.Menu.GroupedList.Item as={Link} to={`${nyAktivitetBasePath}/stilling`}>
                                        En jobb jeg vil søke på
                                    </Dropdown.Menu.GroupedList.Item>

                                    <Dropdown.Menu.GroupedList.Item as={Link} to={`${nyAktivitetBasePath}/ijobb`}>
                                        En jobb jeg har nå
                                    </Dropdown.Menu.GroupedList.Item>
                                </Dropdown.Menu.GroupedList>
                                <Dropdown.Menu.List>
                                    <Dropdown.Menu.List.Item as={Link} to={`${nyAktivitetBasePath}/egen`}>
                                        Jobbrettet egenaktivitet
                                    </Dropdown.Menu.List.Item>
                                    <Dropdown.Menu.List.Item as={Link} to={`${nyAktivitetBasePath}/behandling`}>
                                        Medisinsk behandling
                                    </Dropdown.Menu.List.Item>
                                </Dropdown.Menu.List>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <Filter />
                </div>
                <PeriodeFilter skjulInneverende={!underOppfolging} />
            </div>
            <VisValgtFilter />
        </div>
    );
};

export default Verktoylinje;
