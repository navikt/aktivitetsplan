import React, {Component} from "react";
import {render} from "react-dom";
import {connect} from "react-redux";
import {Route, IndexRoute} from "react-router";
import "../src/index.less";
import App from "../src/app";
import aktivitetsplanRouting from "../src/routing";

render(<App
    routing={aktivitetsplanRouting}
/>, document.getElementById('app'));
