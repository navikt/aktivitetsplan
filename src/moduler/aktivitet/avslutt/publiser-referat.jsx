import { Alert } from '@navikt/ds-react';
import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import * as AppPT from '../../../proptypes';
import { manglerPubliseringAvSamtaleReferat } from '../aktivitet-util';

const PubliserReferat = ({ aktivitet, nyStatus, children }) => {
    if (manglerPubliseringAvSamtaleReferat(aktivitet, nyStatus)) {
        return (
            <Alert variant="error">
                <FormattedMessage id={`aktivitetstatus.mangler-publisering-av-samtalereferat.${aktivitet.type}`} />
            </Alert>
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
