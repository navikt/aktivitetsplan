import React from 'react';
import { Container } from 'nav-frontend-grid';
import Varslinger from '../moduler/varslinger/varslinger';
import AktivitetsTavle from './tavle/aktivitetstavle';
import OppfolgingStatus from '../moduler/oppfolging-status/oppfolging-status';
import Verktoylinje from '../moduler/verktoylinje/verktoylinje';
import HovedsideFeilmelding from '../moduler/feilmelding/hovedsidefeilmelding';
import ArenaFeilmelding from '../moduler/feilmelding/arenafeilmelding';
import MitMaal from './maalLinje/mitt-maal';
import Routing, { PublicRouting } from '../routing';
import { getFodselsnummer } from '../bootstrap/fnr-util';
import AutomatiskInformasjonModal from '../moduler/informasjon/automatisk-informasjon-modal';

function Hovedside() {
    const fnr = getFodselsnummer();

    return (
        <div className="hovedside" key={fnr}>
            <div className="hovedsideinnhold">
                <HovedsideFeilmelding />
                <ArenaFeilmelding />
                <OppfolgingStatus>
                    <Varslinger />
                    <Container>
                        <MitMaal />
                        <Verktoylinje />
                    </Container>
                    <AktivitetsTavle />
                    <Routing />
                    <AutomatiskInformasjonModal />
                </OppfolgingStatus>
                <PublicRouting />
            </div>
        </div>
    );
}

export default Hovedside;
