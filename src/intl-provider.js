import React, { Component } from 'react';
import PT from 'prop-types';
import { addLocaleData, IntlProvider as Provider } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import nb from 'react-intl/locale-data/nb';
import Innholdslaster from './felles-komponenter/utils/innholdslaster';
import { hentLedetekster } from './ducks/ledetekster-reducer';
import { STATUS } from './ducks/utils';
import { hentFeature } from './ducks/feature-reducer';

addLocaleData(nb);

class IntlProvider extends Component {
    componentDidMount() {
        this.props.actions.hentLedetekster();
        this.props.actions.hentFeature();
    }

    componentDidUpdate() {
        const { ledetekster, actions } = this.props;
        if (ledetekster.status === STATUS.NOT_STARTED) {
            actions.hentLedetekster();
        }
    }

    render() {
        const {
            children,
            actions: _,
            ledetekster,
            features,
            ...props
        } = this.props;
        const locale = this.props.locale;

        return (
            <Provider {...props} messages={ledetekster.data[locale] || {}}>
                <div>
                    <Innholdslaster avhengigheter={[ledetekster, features]}>
                        {children}
                    </Innholdslaster>
                </div>
            </Provider>
        );
    }
}

IntlProvider.propTypes = {
    children: PT.node.isRequired,
    actions: PT.objectOf(PT.func).isRequired,
    locale: PT.string.isRequired,
    ledetekster: PT.shape({
        status: PT.string.isRequired,
        data: PT.object,
    }).isRequired,
    features: PT.shape({
        status: PT.string.isRequired,
        data: PT.object,
    }).isRequired,
};

const mapStateToProps = state => ({
    ledetekster: state.data.ledetekster,
    features: state.data.feature,
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            hentLedetekster,
            hentFeature,
        },
        dispatch
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntlProvider);
