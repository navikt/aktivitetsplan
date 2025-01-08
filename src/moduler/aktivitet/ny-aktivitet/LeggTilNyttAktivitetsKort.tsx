import { PlusIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Dropdown } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Status } from '../../../createGenericSlice';
import { useErVeileder } from '../../../Provider';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { useRoutes } from '../../../routing/useRoutes';
import { selectViserHistoriskPeriode } from '../../oppfolging-status/oppfolging-selector';

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
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        // as={Dropdown.Toggle}
                        loading={[Status.RELOADING, Status.PENDING].includes(aktivitetStatus)}
                        className="relative w-full"
                        icon={<PlusIcon role="img" aria-hidden fontSize="1.5rem" />}
                        disabled={aktivitetStatus !== Status.OK || viserHistoriskPeriode}
                    >
                        Legg til aktivitet
                    </Button>
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    {menuItemsGroup.map((item, index) => (
                        <ActionMenu.Group key={item.groupTittel} label={item.groupTittel}>
                            {/*<Dropdown.Menu.GroupedList.Heading>{item.groupTittel}</Dropdown.Menu.GroupedList.Heading>*/}
                            {item.groupedItems.map((subItem) => (
                                <ActionMenu.Item as={Link} to={subItem.link} key={subItem.tittle}>
                                    {subItem.tittle}
                                </ActionMenu.Item>
                            ))}
                            {index != menuItemsGroup.length - 1 ? <ActionMenu.Divider /> : null}
                        </ActionMenu.Group>
                    ))}
                </ActionMenu.Content>
            </ActionMenu>
        </div>
    );
};

export default LeggTilNyttAktivitetsKort;
