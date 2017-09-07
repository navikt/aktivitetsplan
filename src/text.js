import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { selectErUnderOppfolging } from './moduler/situasjon/situasjon-selector';

function Text({ id, children, ...rest }) {
    return (
        <FormattedMessage id={id} values={rest}>
            {children}
        </FormattedMessage>
    );
}

Text.defaultProps = {
    children: null,
};

Text.propTypes = {
    id: PT.string.isRequired,
    children: PT.node,
    privat: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    privat: !selectErUnderOppfolging(state),
});

export default connect(mapStateToProps)(Text);
