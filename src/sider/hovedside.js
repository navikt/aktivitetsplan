import React, { PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import { IKKE_VIS_SIDEBANNER } from '~config';
import Lenke from './../felles-komponenter/lenke';
import Modal from './../felles-komponenter/modal';
import AktivitetsTavle from './hovedside/aktivitetstavle';
import OppfolgingStatus from './oppfolging/oppfolging-status';
import SideBanner from './../felles-komponenter/sidebanner';
import history from './../history';

function Hovedside({ children, routes }) {
    const modalId = routes[routes.length - 1].modalId;

    return (
        <div className="hovedside">
            {IKKE_VIS_SIDEBANNER || <SideBanner />}
            <div className="hovedsideinnhold">
                <OppfolgingStatus visVilkar={false}>
                    <Lenke className="hovedsideinnhold__aktivitetsknapp" href="/aktiviter/ny">
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
