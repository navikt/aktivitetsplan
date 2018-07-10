import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import * as AppPT from '../../proptypes';

function NavigasjonslinjeKnapp({ ariaLabel, lenke, className, history }) {
    return (
        <FormattedMessage id={ariaLabel}>
            {label =>
                <button
                    className={className}
                    aria-label={label}
                    onClick={() => history.push(lenke)}
                />}
        </FormattedMessage>
    );
}

NavigasjonslinjeKnapp.defaultProps = {
    className: '',
};

NavigasjonslinjeKnapp.propTypes = {
    ariaLabel: PT.string.isRequired,
    lenke: PT.string.isRequired,
    history: AppPT.history.isRequired,
    className: PT.string,
};

export default withRouter(NavigasjonslinjeKnapp);
