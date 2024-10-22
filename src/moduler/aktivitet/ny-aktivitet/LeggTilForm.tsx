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

const veilederItems = (nyAktivitetBasePath: string) =>([{
    grouppeTittel : "For NAV-ansatt",
    grouppedItems: [
        { tittle: "Avtale om å søke jobber" , link : `${nyAktivitetBasePath}/sokeavtale`},
        { tittle: "Møte med NAV" , link : `${nyAktivitetBasePath}/mote`},
        { tittle: "Samtalereferat" , link: `${nyAktivitetBasePath}/samtalereferat`},
        ]
},
    {
        grouppeTittel : "For bruker og NAV-ansatt",
        grouppedItems: [
            { tittle: " En jobb jeg vil søke på" , link : `${nyAktivitetBasePath}/stilling`},
            { tittle: " En jobb jeg har nå" , link : `${nyAktivitetBasePath}/ijobb`},
            { tittle: "Jobbrettet egenaktivitet " , link: `${nyAktivitetBasePath}/egen`},
            { tittle: " Medisinsk behandling" , link: `${nyAktivitetBasePath}/behandling`},
        ]
    }
])

const brukerItems = (nyAktivitetBasePath: string) =>([{
        grouppeTittel : "For bruker og NAV-ansatt",
        grouppedItems: [
            { tittle: " En jobb jeg vil søke på" , link : `${nyAktivitetBasePath}/stilling`},
            { tittle: " En jobb jeg har nå" , link : `${nyAktivitetBasePath}/ijobb`},
            { tittle: "Jobbrettet egenaktivitet " , link: `${nyAktivitetBasePath}/egen`},
            { tittle: " Medisinsk behandling" , link: `${nyAktivitetBasePath}/behandling`},
        ]
    }])

const LeggTilForm = () => {
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode);
    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const { nyAktivitetRoute } = useRoutes();
    const nyAktivitetBasePath = nyAktivitetRoute();


    const erVeileder = useErVeileder();
    const menuItemsGroup = erVeileder ? veilederItems(nyAktivitetBasePath) : brukerItems(nyAktivitetBasePath);

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
                            {menuItemsGroup.map((item) => (
                              <Dropdown.Menu.GroupedList>
                                <Dropdown.Menu.GroupedList.Heading>
                                    {item.grouppeTittel}
                                </Dropdown.Menu.GroupedList.Heading>
                                {item.grouppedItems.map((item) =>
                                  <Dropdown.Menu.GroupedList.Item as={Link} to={item.link}>
                                      {item.tittle}
                                  </Dropdown.Menu.GroupedList.Item>)
                                }

                              </Dropdown.Menu.GroupedList>))
                            }
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default LeggTilForm;
