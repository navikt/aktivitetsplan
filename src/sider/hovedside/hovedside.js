import React, { PropTypes as PT } from 'react';
import { Container } from 'nav-frontend-grid';
import { FormattedMessage } from 'react-intl';
import Lenkeknapp from '../../felles-komponenter/utils/lenkeknapp';
import AktivitetsTavle from './aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje';

function Hovedside({ children }) {
    return (
        <div className="hovedside">
            <div className="hovedsideinnhold">
                <Container>
                    <Navigasjonslinje />
                    <Lenkeknapp href="/aktivitet/ny">
                        <FormattedMessage id="nyaktivitetsknapp" />
                    </Lenkeknapp>
                </Container>
                <AktivitetsTavle />
            </div>
            {children}
        </div>

    );
}

Hovedside.defaultProps = {
    children: null,
    routes: null
};

Hovedside.propTypes = {
    children: PT.node
};

Hovedside.defaultProps = {
    children: undefined
};

export default Hovedside;
