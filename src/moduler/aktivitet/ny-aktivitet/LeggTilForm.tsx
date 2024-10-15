import { BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import Lenkepanel from '../../../felles-komponenter/Lenkepanel';
import Modal from '../../../felles-komponenter/modal/Modal';
import { useErVeileder } from '../../../Provider';
import { useRoutes } from '../../../routing/useRoutes';
import { selectAktivitetFeilmeldinger } from '../aktivitet-selector';
import { useNavigate } from 'react-router-dom';

const LeggTilForm = () => {
    const erVeileder = useErVeileder();
    const aktivitetFeilmeldinger = useSelector(selectAktivitetFeilmeldinger);

    const { nyAktivitetRoute, hovedsideRoute } = useRoutes();
    const navigate = useNavigate();
    const tilbake = () => navigate(hovedsideRoute());
    const nyAktivitetBasePath = nyAktivitetRoute();

    return (
        <Modal
            onClose={tilbake}
            contentClass="ny-aktivitet-visning"
            feilmeldinger={aktivitetFeilmeldinger}
            heading="Legg til en aktivitet"
            lukkPåKlikkUtenfor={true}>
            <div className="mb-4">
                {!erVeileder ? (
                    <BodyShort className="mt-6">
                        Her kan du legge til ulike aktiviteter du gjør for å nå målet ditt.
                    </BodyShort>
                ) : null}
            </div>
            {erVeileder ? (
                <div className="space-y-3 flex flex-col bg-surface-alt-3-subtle -mx-[24px] px-8 py-4">
                    <Heading level="2" size="medium">
                        For NAV-ansatt
                    </Heading>
                    <Lenkepanel href={`${nyAktivitetBasePath}/sokeavtale`}>Avtale om å søke jobber</Lenkepanel>
                    <Lenkepanel href={`${nyAktivitetBasePath}/mote`}>Møte med NAV</Lenkepanel>
                    <Lenkepanel href={`${nyAktivitetBasePath}/samtalereferat`}>Samtalereferat</Lenkepanel>
                </div>
            ) : null}
            <div className="mt-8">
                {erVeileder ? (
                    <Heading level="2" size="medium" className="mb-4">
                        For bruker og NAV-ansatt
                    </Heading>
                ) : null}
                <div className="space-y-3 flex flex-col">
                    <Lenkepanel href={`${nyAktivitetBasePath}/stilling`}>En jobb jeg vil søke på</Lenkepanel>
                    <Lenkepanel href={`${nyAktivitetBasePath}/ijobb`}>Jobb jeg har nå</Lenkepanel>
                    <Lenkepanel href={`${nyAktivitetBasePath}/egen`}>Jobbrettet egenaktivitet</Lenkepanel>
                    <Lenkepanel href={`${nyAktivitetBasePath}/behandling`}>Medisinsk behandling</Lenkepanel>
                </div>
            </div>
        </Modal>
    );
};

    //     return (
    //         <div className="min-h-32">
    //             <Dropdown>
    //                 <Dropdown.Menu>
    //                     <Dropdown.Menu.GroupedList>
    //                         <Dropdown.Menu.GroupedList.Heading>
    //                             Systemer og oppslagsverk
    //                         </Dropdown.Menu.GroupedList.Heading>
    //                         <Dropdown.Menu.GroupedList.Item onClick={() => {}}>
    //                             Gosys
    //                         </Dropdown.Menu.GroupedList.Item>
    //                         <Dropdown.Menu.GroupedList.Item as="a" href="https://nav.no">
    //                             Infotrygd
    //                         </Dropdown.Menu.GroupedList.Item>
    //                     </Dropdown.Menu.GroupedList>
    //                     <Dropdown.Menu.Divider />
    //                     <Dropdown.Menu.List>
    //                         <Dropdown.Menu.List.Item as="a" href="https://nav.no">
    //                             Kontakt
    //                         </Dropdown.Menu.List.Item>
    //                         <Dropdown.Menu.List.Item
    //                             as="a"
    //                             href="https://nav.no"
    //                             target="_blank"
    //                         >
    //                             Hjelp (åpner i en ny fane)
    //                         </Dropdown.Menu.List.Item>
    //                     </Dropdown.Menu.List>
    //                 </Dropdown.Menu>
    //             </Dropdown>
    //         </div>
    //     );
    // };

export default LeggTilForm;
