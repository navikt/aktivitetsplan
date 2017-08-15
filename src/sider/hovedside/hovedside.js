import React from 'react';
import PT from 'prop-types';
import { Container } from 'nav-frontend-grid';
import Feil from './feil/feil';
import Varslinger from '../../moduler/varslinger/varslinger';
import Verktoylinje from '../../moduler/verktoylinje/verktoylinje';
import AktivitetsTavle from './tavle/aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje/navigasjonslinje';
import OppfolgingStatus from '../../moduler/oppfolging-status/oppfolging-status';

function Hovedside({ children }) {
    return (
        <div className="hovedside">
            <div className="hovedsideinnhold">
                <div className="feil-container">
                    <Feil />
                </div>
                <OppfolgingStatus>
                    <Varslinger />
                    <Container>
                        <Navigasjonslinje />
                        <Verktoylinje />
                    </Container>
                    <AktivitetsTavle />
                </OppfolgingStatus>
            </div>
            {children}
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
