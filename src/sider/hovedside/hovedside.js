import React, { PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import Lenkeknapp from '../../felles-komponenter/utils/lenkeknapp';
import AktivitetsTavle from './aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje';
import AktivitetsMal from './mal/aktivitetsmal';

function Hovedside({ children }) {
    return (
        <div className="hovedside">
            <div className="hovedsideinnhold">
                <Navigasjonslinje />
                <AktivitetsMal />
                <Lenkeknapp href="/aktivitet/ny">
                    <FormattedMessage id="nyaktivitetsknapp" />
                </Lenkeknapp>
                <AktivitetsTavle />
            </div>
            {children}
        </div>

    );
}

Hovedside.propTypes = {
    children: PT.node
};

Hovedside.defaultProps = {
    children: undefined
};

export default Hovedside;
