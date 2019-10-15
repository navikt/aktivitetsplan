import React from 'react';
import Varslinger from '../moduler/varslinger/varslinger';
import AktivitetsTavle from './tavle/aktivitetstavle';
import InformasjonsHenting from '../moduler/informasjon/informasjon-henting';
import OppfolgingStatus from '../moduler/oppfolging-status/oppfolging-status';
import Verktoylinje from '../moduler/verktoylinje/verktoylinje';
import HovedsideFeilmelding from '../moduler/feilmelding/hovedsidefeilmelding';
import ArenaFeilmelding from '../moduler/feilmelding/arenafeilmelding';
import Maal from './maalLinje/mitt-maal';
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
