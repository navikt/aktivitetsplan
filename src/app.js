import 'babel-polyfill';
import React, { PropTypes as PT } from 'react';
import { Router, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';
import history from './history';
import Provider from './provider';
import './index.less';

const shouldScroll = (prevRouterProps, nextRouterProps) =>
    !(prevRouterProps && nextRouterProps && prevRouterProps.params.temaid && nextRouterProps.params.temaid);

function App({ routing }) {
    return (
        <Provider>
            <Router history={history} render={applyRouterMiddleware(useScroll(shouldScroll))}>
                {routing}
            </Router>
        </Provider>
    );
}

App.propTypes = {
    routing: PT.node.isRequired
};

export default App;
