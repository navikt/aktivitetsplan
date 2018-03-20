import React from 'react';
import PT from 'prop-types';
import { addLocaleData, IntlProvider as Provider } from 'react-intl';
import nb from 'react-intl/locale-data/nb';
import tekster from './tekster'; // eslint-disable-line import/no-unresolved, import/extensions

addLocaleData(nb);

function keys(local) {
    return Object.keys(tekster[local]).map(key => ({key, value: `[${key}]`  })).reduce((previous, current) => {
        previous[current.key] = current.value; // eslint-disable-line no-param-reassign
        return previous;
    }, {});
}

function IntlProvider({ children, locale, ...props }) {
    const tekst =  window.location.href.indexOf('vistekster=true') >= 0 ? keys(locale) : tekster[locale];
    return (
        <Provider {...props} locale={locale} messages={tekst || {}}>
            {children}
        </Provider>
    );
}

IntlProvider.propTypes = {
    children: PT.node.isRequired,
    locale: PT.string.isRequired,
    showKeys: PT.bool
};

export default IntlProvider;
