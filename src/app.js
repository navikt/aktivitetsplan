import 'babel-polyfill';
import React from 'react';
import { Router } from 'react-router-dom';
import SideBanner from './moduler/sidebanner/sidebanner';
import Provider from './provider';
import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import Feature from './felles-komponenter/feature/feature';
import './index.less';
import Routing from './routing';
import routerHistory from './history';
import Hovedside from './sider/hovedside/hovedside';
import { VIS_SIDEBANNER, CONTEXT_PATH, FNR_I_URL } from '~config'; // eslint-disable-line

function App() {
    return (
        <div className="aktivitetsplanfs">
            <Provider>
                <SideBanner visible={VIS_SIDEBANNER} />
                <div className="aktivitetsplan-wrapper">
                    <div className="fullbredde">
                        <Router history={routerHistory}>
                            <Hovedside>
                                <Routing />
                            </Hovedside>
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
