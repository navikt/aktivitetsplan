import React, { PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import Lenke from '../../felles-komponenter/utils/lenke';
import Modal from '../../modal/modal';
import AktivitetsTavle from './aktivitetstavle';
import OppfolgingStatus from '../oppfolging/oppfolging-status';
import history from '../../history';

function Hovedside({ children, routes }) {
    const modalId = routes[routes.length - 1].modalId;

    return (
        <div className="hovedside">
            <div className="hovedsideinnhold">
                <OppfolgingStatus visVilkar={false}>
                    <Lenke className="hovedsideinnhold__aktivitetsknapp" href="/aktivitet/ny">
                        <FormattedMessage id="nyaktivitetsknapp" />
                    </Lenke>
                    <AktivitetsTavle />
                </OppfolgingStatus>
            </div>
            <Modal
                key={modalId}
                isOpen={children != null}
                onRequestClose={() => history.push('/')}
                contentLabel="aktivitet-modal"
            >
                {children}
            </Modal>
        </div>

    );
}

Hovedside.propTypes = {
    children: PT.node,
    routes: PT.arrayOf(PT.shape({ modalId: PT.string })).isRequired
};

export default Hovedside;
