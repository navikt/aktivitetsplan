import React from 'react';
import PT from 'prop-types';
import { Container } from 'nav-frontend-grid';
import Varslinger from '../moduler/varslinger/varslinger';
import Verktoylinje from '../moduler/verktoylinje/verktoylinje';
import AktivitetsTavle from './tavle/aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje/navigasjonslinje';
import OppfolgingStatus from '../moduler/oppfolging-status/oppfolging-status';
import Feilmelding from '../moduler/feilmelding/feilmelding';
import VisaValgtFilter from '../moduler/filtrering/filter-vis-label';
import MitMaal from './maalLinje/mitt-maal';
import FooterInfo from './footer-info';
import Routing, { PublicRouting } from '../routing';
import { getFodselsnummer } from '../bootstrap/fnr-util';

function Hovedside() {
    const fnr = getFodselsnummer();

    return (
        <div className="hovedside" key={fnr}>
            <div className="hovedsideinnhold">
                <Feilmelding className="container" />
                <OppfolgingStatus>
                    <Varslinger />
                    <Container>
                        <MitMaal />
                        <Navigasjonslinje />
                        <Verktoylinje />
                        <VisaValgtFilter />
                    </Container>
                    <AktivitetsTavle />
                    <FooterInfo />
                    <Routing />
                </OppfolgingStatus>
                <PublicRouting />
            </div>
        </div>
    );
}

Hovedside.defaultProps = {
    children: null,
    routes: null,
};

Hovedside.propTypes = {
    children: PT.node,
};

Hovedside.defaultProps = {
    children: undefined,
};

export default Hovedside;
