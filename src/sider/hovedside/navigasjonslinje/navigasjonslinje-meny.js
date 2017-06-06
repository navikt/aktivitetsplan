import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

function NavigasjonslinjeMeny({ intl }) {
    // TODO: Set onClick til å lenke til instillinger-modal
    return (
        <div className="navigasjonslinje-meny">
            <button
                className="navigasjonslinje-meny__innstillinger-knapp"
                aria-label={intl.formatMessage({
                    id: 'navigasjonslinje-meny.innstillinger',
                })}
            />
        </div>
    );
}

NavigasjonslinjeMeny.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(NavigasjonslinjeMeny);
