import { Heading } from '@navikt/ds-react';
import PT from 'prop-types';
import React from 'react';

import { aktivitetStatusMap } from '../../../../utils/textMappers';

function StatusVisning(props) {
    const { status } = props;
    return (
        <Heading level="2" size="small">
            {aktivitetStatusMap[status]}
        </Heading>
    );
}

StatusVisning.propTypes = {
    status: PT.string.isRequired,
};

export default StatusVisning;
