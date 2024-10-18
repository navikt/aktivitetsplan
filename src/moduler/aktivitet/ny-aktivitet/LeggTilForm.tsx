import { PlusIcon } from '@navikt/aksel-icons';
import { Button, Dropdown} from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Status } from '../../../createGenericSlice';
import { useErVeileder } from '../../../Provider';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { selectViserHistoriskPeriode } from '../../filtrering/filter/filter-selector';
import { useRoutes } from '../../../routing/useRoutes';



const LeggTilForm = () => {
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode);
    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const { nyAktivitetRoute } = useRoutes();
    const nyAktivitetBasePath = nyAktivitetRoute();


    const erVeileder = useErVeileder();

    return (
        <div className="self-stretch sm:self-auto">
            <Dropdown>
                <Button
                    as={Dropdown.Toggle}
                    loading={[Status.RELOADING, Status.PENDING].includes(aktivitetStatus)}
                    className="relative w-full"
                    icon={<PlusIcon role="img" aria-hidden fontSize="1.5rem" />}
                    disabled={viserHistoriskPeriode || aktivitetStatus === Status.ERROR}>
                    Legg til aktivitet
                </Button>
                <Dropdown.Menu>
                    <Dropdown.Menu.GroupedList>
                    {erVeileder ? (
                        <div>
                            <Dropdown.Menu.GroupedList.Heading>
                                For NAV-ansatt
                            </Dropdown.Menu.GroupedList.Heading>
                                <Dropdown.Menu.List.Item as={Link} to={`${nyAktivitetBasePath}/sokeavtale`}>
                                    Avtale om å søke jobber
                                </Dropdown.Menu.List.Item>
                                <Dropdown.Menu.List.Item as={Link} to={`${nyAktivitetBasePath}/mote`}>
                                    Møte med NAV
                                </Dropdown.Menu.List.Item>
                                <Dropdown.Menu.List.Item as={Link} to={`${nyAktivitetBasePath}/samtalereferat`}>
                                    Samtalereferat
                                </Dropdown.Menu.List.Item>
                            <Dropdown.Menu.Divider />
                            <Dropdown.Menu.GroupedList.Heading>
                                For bruker og NAV-ansatt
                            </Dropdown.Menu.GroupedList.Heading>
                        </div>
                    ) :
                            <Dropdown.Menu.GroupedList.Heading>
                            Velg type aktivitet
                        </Dropdown.Menu.GroupedList.Heading>}
                        <Dropdown.Menu.List.Item as={Link} to={`${nyAktivitetBasePath}/stilling`}>
                            En jobb jeg vil søke på
                        </Dropdown.Menu.List.Item>
                        <Dropdown.Menu.List.Item as={Link} to={`${nyAktivitetBasePath}/ijobb`}>
                            En jobb jeg har nå
                        </Dropdown.Menu.List.Item>
                        <Dropdown.Menu.List.Item as={Link} to={`${nyAktivitetBasePath}/egen`}>
                            Jobbrettet egenaktivitet
                        </Dropdown.Menu.List.Item>
                        <Dropdown.Menu.List.Item as={Link} to={`${nyAktivitetBasePath}/behandling`}>
                            Medisinsk behandling
                        </Dropdown.Menu.List.Item>
                    </Dropdown.Menu.GroupedList>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default LeggTilForm;
