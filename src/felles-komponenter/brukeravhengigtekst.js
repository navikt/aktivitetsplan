import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

function BrukerAvhengigTekst({ id, erBruker }) {
    const postFix = erBruker ? 'bruker' : 'veileder';
    const labelId = `${id}.${postFix}`;
    return <FormattedMessage id={labelId} />;
}

BrukerAvhengigTekst.propTypes = {
    id: PT.string.isRequired,
    erBruker: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    erBruker: state.data.identitet.erBruker,
});

export default connect(mapStateToProps, null)(BrukerAvhengigTekst);
