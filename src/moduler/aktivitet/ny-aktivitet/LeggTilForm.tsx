import { BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import Lenkepanel from '../../../felles-komponenter/lenkepanel';
import Modal from '../../../felles-komponenter/modal/Modal';
import { selectErVeileder } from '../../identitet/identitet-selector';
import { selectAktivitetFeilmeldinger } from '../aktivitet-selector';

const LeggTilForm = () => {
    const erVeileder = useSelector(selectErVeileder);
    const aktivitetFeilmeldinger = useSelector(selectAktivitetFeilmeldinger);

    return (
        <Modal
            contentLabel="ny-aktivitet-modal"
            contentClass="ny-aktivitet-visning"
            feilmeldinger={aktivitetFeilmeldinger}
        >
            <div className="mb-8">
                <Heading level="2" size="large">
                    Legg til en aktiviet
                </Heading>
                <BodyShort hidden={erVeileder}>
                    Her kan du legge til ulike aktiviteter du gjør for å nå målet ditt.
                </BodyShort>
            </div>
            <div hidden={!erVeileder} className="space-y-3 flex flex-col bg-surface-alt-3-subtle -mx-8 px-8 -my-4 py-4">
                <Heading size="medium">For NAV-ansatt</Heading>
                <Lenkepanel border href="/aktivitet/ny/sokeavtale" hidden={!erVeileder}>
                    Avtale om å søke jobber
                </Lenkepanel>
                <Lenkepanel border href="/aktivitet/ny/mote" hidden={!erVeileder}>
                    Møte med NAV
                </Lenkepanel>
                <Lenkepanel border href="/aktivitet/ny/samtalereferat" hidden={!erVeileder}>
                    Samtalereferat
                </Lenkepanel>
            </div>
            <div className="mt-8">
                {erVeileder ? (
                    <Heading size="medium" className="mb-4">
                        For bruker og NAV-ansatt
                    </Heading>
                ) : null}
                <div className="space-y-3 flex flex-col">
                    <Lenkepanel border href="/aktivitet/ny/stilling" hidden={false}>
                        En jobb jeg vil søke på
                    </Lenkepanel>
                    <Lenkepanel border href="/aktivitet/ny/ijobb" hidden={false}>
                        Jobb jeg har nå
                    </Lenkepanel>
                    <Lenkepanel border href="/aktivitet/ny/egen" hidden={false}>
                        Jobbrettet egenaktivitet
                    </Lenkepanel>
                    <Lenkepanel border href="/aktivitet/ny/behandling" hidden={false}>
                        Medisinsk behandling
                    </Lenkepanel>
                </div>
            </div>
        </Modal>
    );
};

export default LeggTilForm;
