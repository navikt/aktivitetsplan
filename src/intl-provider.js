import React, { Component, PropTypes as PT } from 'react';
import { addLocaleData, IntlProvider as Provider } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import nb from 'react-intl/locale-data/nb';
import Innholdslaster from './felles-komponenter/innholdslaster';
import { hentLedetekster } from './ducks/ledetekster-ressurs';
import DevTools from './devtools';

addLocaleData(nb);

class IntlProvider extends Component {
    componentDidMount() {
        this.props.actions.hentLedetekster();
    }

    render() {
        const { children, actions: _, ledetekster, ...props } = this.props;
        const locale = this.props.locale;

        return (
            <Provider {...props} messages={ledetekster.data[locale] || {}}>
                <div>
                    <Innholdslaster avhengigheter={[ledetekster]}>
                        {children}
                    </Innholdslaster>
                    <div aria-hidden="true">
                        <DevTools />
                    </div>
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
        data: PT.object
    }).isRequired
};

const mapStateToProps = (state) => ({
    ledetekster: state.data.ledetekster
});
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        hentLedetekster
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(IntlProvider);
