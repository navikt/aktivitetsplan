import "babel-polyfill";
import React, {PropTypes as PT} from "react";
import {Router, Route, IndexRoute, applyRouterMiddleware} from "react-router";
import {useScroll} from "react-router-scroll";
import {indexRoute} from "~config";
import history from "./history";
import Provider from "./provider";

const shouldScroll = (prevRouterProps, nextRouterProps) =>
    !(prevRouterProps && nextRouterProps && prevRouterProps.params.temaid && nextRouterProps.params.temaid);

function App({applicationComponent, routing}) {
    return (
        <Provider>
            <Router history={history} render={applyRouterMiddleware(useScroll(shouldScroll))}>
                <Route path="/" component={applicationComponent}>
                    {routing}
                </Route>
            </Router>
        </Provider>
    );
}

App.propTypes = {
    indexRoute: PT.string,
    applicationComponent: PT.func.isRequired
};

export default App;
