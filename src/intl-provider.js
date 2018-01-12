import React from 'react';
import PT from 'prop-types';
import { addLocaleData, IntlProvider as Provider } from 'react-intl';
import { connect } from 'react-redux';
import nb from 'react-intl/locale-data/nb';

addLocaleData(nb);

function IntlProvider({ children, ledetekster, locale, ...props }) {
    return (
        <Provider
            {...props}
            locale={locale}
            messages={ledetekster.data[locale] || {}}
        >
            {children}
        </Provider>
    );
}

IntlProvider.propTypes = {
    children: PT.node.isRequired,
    locale: PT.string.isRequired,
    ledetekster: PT.shape({
        status: PT.string.isRequired,
        data: PT.object,
    }).isRequired,
};

const mapStateToProps = state => ({
    ledetekster: state.data.ledetekster,
});

export default connect(mapStateToProps)(IntlProvider);
