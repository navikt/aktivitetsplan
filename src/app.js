import 'babel-polyfill';
import React from 'react';
import { Router } from 'react-router-dom';
import SideBanner from './moduler/sidebanner/sidebanner';
import Provider from './provider';
import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import ConfigToggle from './felles-komponenter/feature/config-toggle';
import routerHistory from './history';
import ScrollToTop from './felles-komponenter/utils/scroll-to-top';
import { VIS_SIDEBANNER } from '~config'; // eslint-disable-line
import Hovedside from './hovedside/hovedside';
import './index.less';

function App() {
    return (
        <div className="aktivitetsplanfs">
            <Provider>
                <SideBanner visible={VIS_SIDEBANNER} />
                <div className="aktivitetsplan-wrapper">
                    <div className="fullbredde">
                        <Router history={routerHistory}>
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

export default App;
