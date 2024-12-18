import { PlusIcon } from '@navikt/aksel-icons';
import { Button, Dropdown } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Status } from '../../../createGenericSlice';
import { useErVeileder } from '../../../Provider';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { selectViserHistoriskPeriode } from '../../filtrering/filter/filter-selector';
import { useRoutes } from '../../../routing/useRoutes';

const veilederAktivitetsValg = (nyAktivitetBasePath: string) => [
    {
        groupTittel: 'For NAV-ansatt',
        groupedItems: [
            { tittle: 'Avtale om å søke jobber', link: `${nyAktivitetBasePath}/sokeavtale` },
            { tittle: 'Møte med NAV', link: `${nyAktivitetBasePath}/mote` },
            { tittle: 'Samtalereferat', link: `${nyAktivitetBasePath}/samtalereferat` },
        ],
    },
    {
        groupTittel: 'For bruker og NAV-ansatt',
        groupedItems: [
            { tittle: ' En jobb jeg vil søke på', link: `${nyAktivitetBasePath}/stilling` },
            { tittle: ' En jobb jeg har nå', link: `${nyAktivitetBasePath}/ijobb` },
            { tittle: 'Jobbrettet egenaktivitet ', link: `${nyAktivitetBasePath}/egen` },
            { tittle: ' Medisinsk behandling', link: `${nyAktivitetBasePath}/behandling` },
        ],
    },
];

const brukerAktivitetsValg = (nyAktivitetBasePath: string) => [
    {
        groupTittel: 'Velg type aktivitet',
        groupedItems: [
            { tittle: ' En jobb jeg vil søke på', link: `${nyAktivitetBasePath}/stilling` },
            { tittle: ' En jobb jeg har nå', link: `${nyAktivitetBasePath}/ijobb` },
            { tittle: 'Jobbrettet egenaktivitet ', link: `${nyAktivitetBasePath}/egen` },
            { tittle: ' Medisinsk behandling', link: `${nyAktivitetBasePath}/behandling` },
        ],
    },
];

const LeggTilNyttAktivitetsKort = () => {
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode);
    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const { nyAktivitetRoute } = useRoutes();
    const nyAktivitetBasePath = nyAktivitetRoute();

    const erVeileder = useErVeileder();
    const menuItemsGroup = erVeileder
        ? veilederAktivitetsValg(nyAktivitetBasePath)
        : brukerAktivitetsValg(nyAktivitetBasePath);
    return (
        <div className="self-stretch sm:self-auto">
            <Dropdown>
                <Button
                    as={Dropdown.Toggle}
                    loading={[Status.RELOADING, Status.PENDING].includes(aktivitetStatus)}
                    className="relative w-full"
                    icon={<PlusIcon role="img" aria-hidden fontSize="1.5rem" />}
                    disabled={aktivitetStatus !== Status.OK || viserHistoriskPeriode}
                >
                    Legg til aktivitet
                </Button>
                <Dropdown.Menu>
                    {menuItemsGroup.map((item, index) => (
                        <Dropdown.Menu.GroupedList key={item.groupTittel}>
                            <Dropdown.Menu.GroupedList.Heading>{item.groupTittel}</Dropdown.Menu.GroupedList.Heading>
                            {item.groupedItems.map((subItem, subIndex) => (
                                <Dropdown.Menu.GroupedList.Item as={Link} to={subItem.link} key={subIndex}>
                                    {subItem.tittle}
                                </Dropdown.Menu.GroupedList.Item>
                            ))}
                            {index != menuItemsGroup.length - 1 ? <Dropdown.Menu.Divider /> : null}
                        </Dropdown.Menu.GroupedList>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default LeggTilNyttAktivitetsKort;
