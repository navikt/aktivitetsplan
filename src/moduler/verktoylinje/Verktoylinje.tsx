import { PlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Dropdown, Heading, Link } from '@navikt/ds-react';
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
import { useErVeileder } from '../../Provider';
import Lenkepanel from '../../felles-komponenter/Lenkepanel';

const Verktoylinje = () => {
    const underOppfolging: boolean = useSelector(selectErUnderOppfolging);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode);
    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const navigate = useNavigate();
    const { nyAktivitetRoute } = useRoutes();
    const nyAktivitetBasePath = nyAktivitetRoute();
    const erVeileder = useErVeileder();

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
                                        <Heading level="2" size="medium">
                                            For NAV-ansatt
                                        </Heading>
                                        <Dropdown.Menu.GroupedList>
                                        <Dropdown.Menu.GroupedList.Item as={Link} href={`${nyAktivitetBasePath}/sokeavtale`}>Avtale om å søke jobber</Dropdown.Menu.GroupedList.Item>
                                        <Dropdown.Menu.GroupedList.Item as={Link} href={`${nyAktivitetBasePath}/mote`}>Møte med NAV</Dropdown.Menu.GroupedList.Item>
                                        <Dropdown.Menu.GroupedList.Item as={Link} href={`${nyAktivitetBasePath}/samtalereferat`}>Samtalereferat</Dropdown.Menu.GroupedList.Item>
                                        </Dropdown.Menu.GroupedList>
                                    </div>
                                ) : null}


                                {erVeileder ? (
                                    <Heading level="1" size="medium" className="mb-4">
                                        For bruker og NAV-ansatt
                                    </Heading>
                                ) : null}
                                <Dropdown.Menu.GroupedList>
                                    <Dropdown.Menu.GroupedList.Heading>
                                        Velg type aktivitet
                                    </Dropdown.Menu.GroupedList.Heading>
                                    <Dropdown.Menu.GroupedList.Item as={Link} href={`${nyAktivitetBasePath}/stilling`}>
                                        En jobb jeg vil søke på
                                    </Dropdown.Menu.GroupedList.Item>
                                    <Dropdown.Menu.GroupedList.Item as="a" href={`${nyAktivitetBasePath}/ijobb`}>
                                        En jobb jeg har nå
                                    </Dropdown.Menu.GroupedList.Item>
                                </Dropdown.Menu.GroupedList>
                                <Dropdown.Menu.List>
                                    <Dropdown.Menu.List.Item as={Link} href={`${nyAktivitetBasePath}/egen`}>
                                        Jobbrettet egenaktivitet
                                    </Dropdown.Menu.List.Item>
                                    <Dropdown.Menu.List.Item
                                        as={Link}
                                        href="https://nav.no"
                                    >
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
