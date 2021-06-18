import { Element } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';

import { aktivitetStatusMap } from '../../../../utils/textMappers';

function StatusVisning(props) {
    const { status } = props;
    return <Element>{aktivitetStatusMap[status]}</Element>;
}

StatusVisning.propTypes = {
    status: PT.string.isRequired,
};

export default StatusVisning;
