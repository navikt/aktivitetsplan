import React from 'react';
import PT from 'prop-types';
import { Container } from 'nav-frontend-grid';
import Varslinger from '../../moduler/varslinger/varslinger';
import Verktoylinje from '../../moduler/verktoylinje/verktoylinje';
import AktivitetsTavle from './tavle/aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje/navigasjonslinje';
import OppfolgingStatus from '../../moduler/oppfolging-status/oppfolging-status';
import Feilmelding from '../../moduler/feilmelding/feilmelding';
import VisaValgtFilter from '../../moduler/filtrering/filter-vis-label';
import FooterInfo from './footer-info';
import Routing, { PublicRouting } from '../../routing';

function Hovedside() {
    return (
        <div className="hovedside">
            <div className="hovedsideinnhold">
                <Feilmelding className="container" />
                <OppfolgingStatus>
                    <Varslinger />
                    <Container>
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
