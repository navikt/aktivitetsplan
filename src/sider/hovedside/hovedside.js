import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Container } from 'nav-frontend-grid';
import { FormattedMessage } from 'react-intl';
import Lenkeknapp from '../../felles-komponenter/utils/lenkeknapp';
import Modal from '../../modal/modal';
import Feil from './feil';
import AktivitetsTavle from './aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje';
import history from '../../history';
import { LUKK_MODAL } from '../../ducks/modal';

function Hovedside({ children, routes, lukkModal }) {
    const modalId = routes && routes[routes.length - 1].modalId;
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
                <Container>
                    <Feil />
                    <Navigasjonslinje />
                    <Lenkeknapp href="/aktivitet/ny">
                        <FormattedMessage id="nyaktivitetsknapp" />
                    </Lenkeknapp>
                </Container>
                <AktivitetsTavle />
            </div>
            {modal}
        </div>

    );
}

Hovedside.defaultProps = {
    children: null,
    routes: null
};

Hovedside.propTypes = {
    children: PT.node,
    routes: PT.arrayOf(PT.shape({ modalId: PT.string })),
    lukkModal: PT.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    lukkModal: () => dispatch({ type: LUKK_MODAL })
});

export default connect(null, mapDispatchToProps)(Hovedside);
