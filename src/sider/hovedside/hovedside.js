import React, { PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import Lenke from '../../felles-komponenter/utils/lenke';
import Modal from '../../modal/modal';
import AktivitetsTavle from './aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje';
import history from '../../history';
import AktivitetsMal from './mal/aktivitetsmal';

function Hovedside({ children, routes }) {
    const modalId = routes && routes[routes.length - 1].modalId;
    const modal = !children ? (null) : (<Modal
        key={modalId}
        isOpen={children != null}
        onRequestClose={() => history.push('/')}
        contentLabel="aktivitet-modal"
    >
        {children}
    </Modal>);

    return (
        <div className="hovedside">
            <div className="hovedsideinnhold">
                <Navigasjonslinje />
                <AktivitetsMal />
                <Lenke className="hovedsideinnhold__aktivitetsknapp" href="/aktivitet/ny">
                    <FormattedMessage id="nyaktivitetsknapp" />
                </Lenke>
                <AktivitetsTavle />
            </div>
            {modal}
        </div>

    );
}

Hovedside.propTypes = {
    children: PT.node,
    routes: PT.arrayOf(PT.shape({ modalId: PT.string }))
};

export default Hovedside;
