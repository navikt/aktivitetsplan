import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { selectErBruker } from '../moduler/identitet/identitet-selector';

function BrukerAvhengigTekst({ id, erBruker, endretAv }) {
    const postFix = erBruker ? 'bruker' : 'veileder';
    const labelId = `${id}.${postFix}`;
    return <FormattedMessage id={labelId} values={{ endretAv }} />;
}

BrukerAvhengigTekst.propTypes = {
    id: PT.string.isRequired,
    erBruker: PT.bool.isRequired,
    endretAv: PT.string,
};
BrukerAvhengigTekst.defaultProps = {
    endretAv: undefined,
};

const mapStateToProps = (state) => ({
    erBruker: selectErBruker(state),
});

export default connect(mapStateToProps, null)(BrukerAvhengigTekst);
