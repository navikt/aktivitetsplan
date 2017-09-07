import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { selectErUnderOppfolging } from './moduler/situasjon/situasjon-selector';

// eslint-disable-next-line react/prop-types
function Text({ id, children, ...rest }) {
    return (
        <FormattedMessage id={id} values={rest}>
            {children}
        </FormattedMessage>
    );
}

const mapStateToProps = state => ({
    underOppfolging: selectErUnderOppfolging(state),
});

export default connect(mapStateToProps)(Text);
