import 'babel-polyfill';
import React from 'react';
import PT from 'prop-types';
import { Router, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';
import history from './history';
import Provider from './provider';
import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import Feature from './felles-komponenter/feature/feature';
import './index.less';

const shouldScroll = (prevRouterProps, nextRouterProps) =>
    !(prevRouterProps &&
        nextRouterProps &&
        prevRouterProps.params.temaid &&
        nextRouterProps.params.temaid);

function App({ routing }) {
    return (
        <div className="aktivitetsplanfs">
            <Provider>
                <div className="fullbredde">
                    <Router
                        history={history}
                        render={applyRouterMiddleware(useScroll(shouldScroll))}
                    >
                        {routing}
                    </Router>
                    <Feature name="timeoutbox">
                        <Timeoutbox />
                    </Feature>
                </div>
            </Provider>
        </div>
    );
}

App.propTypes = {
    routing: PT.node.isRequired,
};

export default App;
