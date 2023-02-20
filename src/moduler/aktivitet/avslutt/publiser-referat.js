import { Alert } from '@navikt/ds-react';
import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import * as AppPT from '../../../proptypes';
import { manglerPubliseringAvSamtaleReferat } from '../aktivitet-util';

const PubliserReferat = ({ aktivitet, nyStatus, children }) => {
    if (manglerPubliseringAvSamtaleReferat(aktivitet, nyStatus)) {
        return (
            <ModalContainer className="publiser-referat">
                <Alert variant="error">
                    <FormattedMessage id={`aktivitetstatus.mangler-publisering-av-samtalereferat.${aktivitet.type}`} />
                </Alert>
            </ModalContainer>
        );
    }
    return children;
};

PubliserReferat.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    nyStatus: PT.string,
    children: PT.node,
};

PubliserReferat.defaultProps = {
    nyStatus: undefined,
};

export default PubliserReferat;
