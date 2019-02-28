import 'babel-polyfill';
import React, { PropTypes as PT } from 'react';
import { Router } from 'react-router-dom';
import SideBanner from './moduler/sidebanner/sidebanner';
import Provider from './provider';
import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import ConfigToggle from './felles-komponenter/feature/config-toggle';
import createHistory from './history';
import ScrollToTop from './felles-komponenter/utils/scroll-to-top';
import { VIS_SIDEBANNER } from '~config'; // eslint-disable-line
import Hovedside from './hovedside/hovedside';
import './index.less';

const history = createHistory();

window.apneVerktoyModal = () => {
    history.push('/innstillinger');
};

function App({ fnr }) {
    return (
        <div className="aktivitetsplanfs">
            <Provider key={fnr}>
                <SideBanner visible={VIS_SIDEBANNER} />
                <div className="aktivitetsplan-wrapper">
                    <div className="fullbredde">
                        <Router history={history}>
                            <ScrollToTop>
                                <Hovedside />
                            </ScrollToTop>
                        </Router>
                        <ConfigToggle name="timeoutbox">
                            <Timeoutbox />
                        </ConfigToggle>
                    </div>
                </div>
            </Provider>
        </div>
    );
}

App.propTypes = {
    fnr: PT.string,
};

App.defaultProps = {
    fnr: undefined,
};

export default App;
