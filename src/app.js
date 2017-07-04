import 'babel-polyfill';
import React from 'react';
import { Router, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';
import SideBanner from './moduler/sidebanner/sidebanner';
import history from './history';
import Provider from './provider';
import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import Feature from './felles-komponenter/feature/feature';
import './index.less';
import routing from './routing';
import { VIS_SIDEBANNER } from '~config'; // eslint-disable-line

const shouldScroll = (prevRouterProps, nextRouterProps) =>
    !(prevRouterProps &&
        nextRouterProps &&
        prevRouterProps.params.temaid &&
        nextRouterProps.params.temaid);

function App() {
    return (
        <div className="aktivitetsplanfs">
            <Provider>
                <SideBanner visible={VIS_SIDEBANNER} />
                <div className="aktivitetsplan-wrapper">
                    <div className="fullbredde">
                        <Router
                            history={history}
                            render={applyRouterMiddleware(
                                useScroll(shouldScroll)
                            )}
                        >
                            {routing}
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
