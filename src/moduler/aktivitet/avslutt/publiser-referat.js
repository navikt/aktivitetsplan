import AlertStripe from 'nav-frontend-alertstriper';
import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import * as AppPT from '../../../proptypes';
import { manglerPubliseringAvSamtaleReferat } from '../aktivitet-util';

function PubliserReferat({ aktivitet, nyStatus, children }) {
    if (manglerPubliseringAvSamtaleReferat(aktivitet, nyStatus)) {
        return (
            <ModalContainer className="publiser-referat">
                <AlertStripe type="feil">
                    <FormattedMessage id={`aktivitetstatus.mangler-publisering-av-samtalereferat.${aktivitet.type}`} />
                </AlertStripe>
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
