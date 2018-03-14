import React from 'react';
import PT from 'prop-types';
import { addLocaleData, IntlProvider as Provider } from 'react-intl';
import nb from 'react-intl/locale-data/nb';
import tekster from './tekster';  // eslint-disable-line import/extensions import/no-unresolved

addLocaleData(nb);

function IntlProvider({ children, locale, ...props }) {
    return (
        <Provider {...props} locale={locale} messages={tekster.nb || []}>
            {children}
        </Provider>
    );
}

IntlProvider.propTypes = {
    children: PT.node.isRequired,
    locale: PT.string.isRequired,
};

export default IntlProvider;
