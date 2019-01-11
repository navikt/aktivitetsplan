import React from 'react';
import { Container } from 'nav-frontend-grid';
import Varslinger from '../moduler/varslinger/varslinger';
import Verktoylinje from '../moduler/verktoylinje/verktoylinje';
import AktivitetsTavle from './tavle/aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje/navigasjonslinje';
import OppfolgingStatus from '../moduler/oppfolging-status/oppfolging-status';
import HovedsideFeilmelding from '../moduler/feilmelding/hovedsidefeilmelding';
import ArenaFeilmelding from '../moduler/feilmelding/arenafeilmelding';
import PrivateFeilmelding from '../moduler/feilmelding/private-feilmelding';
import VisaValgtFilter from '../moduler/filtrering/filter-vis-label';
import MitMaal from './maalLinje/mitt-maal';
import Routing, { PublicRouting } from '../routing';
import { getFodselsnummer } from '../bootstrap/fnr-util';

function Hovedside() {
    const fnr = getFodselsnummer();

    return (
        <div className="hovedside" key={fnr}>
            <div className="hovedsideinnhold">
                <Navigasjonslinje />
                <HovedsideFeilmelding />
                <ArenaFeilmelding />
                <OppfolgingStatus>
                    <PrivateFeilmelding />
                    <Varslinger />
                    <Container>
                        <MitMaal />
                        <Verktoylinje />
                        <VisaValgtFilter />
                    </Container>
                    <AktivitetsTavle />
                    <Routing />
                </OppfolgingStatus>
                <PublicRouting />
            </div>
        </div>
    );
}

export default Hovedside;
