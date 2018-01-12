import React from 'react';
import PT from 'prop-types';
import { addLocaleData, IntlProvider as Provider } from 'react-intl';
import { connect } from 'react-redux';
import nb from 'react-intl/locale-data/nb';
import { selectLedeteksterData } from './ducks/ledetekster-selector';

addLocaleData(nb);

function IntlProvider({ children, ledetekster, locale, ...props }) {
    return (
        <Provider
            {...props}
            locale={locale}
            messages={ledetekster[locale] || {}}
        >
            {children}
        </Provider>
    );
}

IntlProvider.propTypes = {
    children: PT.node.isRequired,
    locale: PT.string.isRequired,
    ledetekster: PT.object.isRequired,
};

const mapStateToProps = state => ({
    ledetekster: selectLedeteksterData(state),
});

export default connect(mapStateToProps)(IntlProvider);
