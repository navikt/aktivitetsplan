import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import history from '../../../history';

function NavigasjonslinjeMeny({ intl }) {
    return (
        <div className="navigasjonslinje-meny">
            <button
                className="navigasjonslinje-meny__innstillinger-knapp"
                aria-label={intl.formatMessage({
                    id: 'navigasjon.innstillinger',
                })}
                onClick={() => history.push('/innstillinger')}
            />
        </div>
    );
}

NavigasjonslinjeMeny.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(NavigasjonslinjeMeny);
