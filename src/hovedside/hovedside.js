import React from 'react';
import Varslinger from '../moduler/varslinger/varslinger';
import AktivitetsTavle from './tavle/aktivitetstavle';
import InformasjonsHenting from '../moduler/informasjon/informasjonHenting';
import OppfolgingStatus from '../moduler/oppfolging-status/oppfolging-status';
import Navigasjonslinje from '../moduler/verktoylinje/navigasjonslinje';
import Verktoylinje from '../moduler/verktoylinje/verktoylinje';
import HovedsideFeilmelding from '../moduler/feilmelding/hovedsidefeilmelding';
import ArenaFeilmelding from '../moduler/feilmelding/arenafeilmelding';
import Maal from '../moduler/mal-linje/mitt-maal';
import Routing, { PublicRouting } from '../routing';
import { getFodselsnummer } from '../bootstrap/fnr-util';

function Hovedside() {
    const fnr = getFodselsnummer();

    return (
        <div className="hovedside" key={fnr}>
            <div className="hovedsideinnhold">
                <HovedsideFeilmelding />
                <ArenaFeilmelding />
                <OppfolgingStatus>
                    <InformasjonsHenting />
                    <Varslinger />
                    <div className="container">
                        <Navigasjonslinje />
                        <Maal />
                        <Verktoylinje />
                    </div>
                    <AktivitetsTavle />
                    <Routing />
                </OppfolgingStatus>
                <PublicRouting />
            </div>
        </div>
    );
}

export default Hovedside;
