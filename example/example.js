import React, {Component} from "react";
import {render} from "react-dom";
import {connect} from "react-redux";
import {Route, IndexRoute} from "react-router";
import ReactModal from "react-modal";
import "../src/index.less";
import App from "../src/app";
import aktivitetsplanRouting from "../src/routing";

ReactModal.setAppElement('#modal-a11y-wrapper');

render(<App
    routing={aktivitetsplanRouting}
/>, document.getElementById('app'));
