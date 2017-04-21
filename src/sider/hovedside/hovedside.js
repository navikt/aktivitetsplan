import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Lenke from '../../felles-komponenter/utils/lenke';
import Modal from '../../modal/modal';
import AktivitetsTavle from './aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje';
import history from '../../history';
import AktivitetsMal from './mal/aktivitetsmal';
import { LUKK_MODAL } from '../../ducks/modal';

function Hovedside({ children, routes, lukkModal }) {
    const modalId = routes[routes.length - 1].modalId;
    const modal = !children ? (null) : (<Modal
        key={modalId}
        isOpen={children != null}
        onRequestClose={
            () => {
                history.push('/');
                lukkModal();
            }
        }
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
    routes: PT.arrayOf(PT.shape({ modalId: PT.string })).isRequired
};

const mapDispatchToProps = (dispatch) => ({
    lukkModal: () => dispatch({ type: LUKK_MODAL })
});

export default connect(null, mapDispatchToProps)(Hovedside);
