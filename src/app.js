import 'babel-polyfill';
import React from 'react';
import { Router } from 'react-router-dom';
import SideBanner from './moduler/sidebanner/sidebanner';
import Provider from './provider';
import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import Feature from './felles-komponenter/feature/feature';
import './index.less';
import routerHistory from './history';
import ScrollToTop from './felles-komponenter/utils/scroll-to-top';
import { VIS_SIDEBANNER } from '~config'; // eslint-disable-line
import Hovedside from './hovedside/hovedside';

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
                                <Feature name="timeoutbox">
                                    <Timeoutbox />
                                </Feature>
                    </div>
                </div>
            </Provider>
        </div>
    );
}

export default App;
