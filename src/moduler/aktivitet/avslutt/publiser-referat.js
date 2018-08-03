import React from 'react';
import PT from 'prop-types';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';
import { manglerPubliseringAvSamtaleReferat } from '../aktivitet-util';
import OppdaterReferatContainer from '../visning/status-oppdatering/oppdater-referat-container';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import * as AppPT from '../../../proptypes';

function PubliserReferat({ aktivitet, nyStatus, children }) {
    if (manglerPubliseringAvSamtaleReferat(aktivitet, nyStatus)) {
        return (
            <ModalContainer className="publiser-referat">
                <AlertStripeInfoSolid className="publiser-referat__info">
                    <FormattedMessage
                        id={`aktivitetstatus.mangler-publisering-av-samtalereferat.${aktivitet.type}`}
                    />
                </AlertStripeInfoSolid>
                <OppdaterReferatContainer aktivitet={aktivitet} />
            </ModalContainer>
        );
    }
    return children;
}

PubliserReferat.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    nyStatus: PT.string,
    children: PT.node.isRequired,
};

PubliserReferat.defaultProps = {
    nyStatus: undefined,
};

export default PubliserReferat;
