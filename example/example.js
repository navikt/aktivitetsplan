import React, {Component} from "react";
import {render} from "react-dom";
import {connect} from "react-redux";
import {Route, IndexRoute} from "react-router";
import "../src/index.less";
import {EKSEMPEL_FNR} from './config';
import {hentPerson,setNAVsomMotpart} from '../src/ducks/motpart';
import App from "../src/app";
import aktivitetsplanRouting from "../src/routing";

class Eksempel extends Component {

    componentDidMount() {
        this.props.velgMotpart();
    }

    render() {
        return <div>{this.props.children}</div>
    }

}

const mapStateToProps = () => {
    return {};
};
const mapDispatchToProps = (dispatch) => ({
    velgMotpart: () => {
        if (Math.random() < 0.5) {
            dispatch(hentPerson(EKSEMPEL_FNR));
        } else {
            dispatch(setNAVsomMotpart());
        }
    }
});
const ConnectedEksempel = connect(mapStateToProps, mapDispatchToProps)(Eksempel);

const eksempelRouting = (
    <Route path="/" component={ConnectedEksempel}>
        {aktivitetsplanRouting}
    </Route>
);

render(<App
    routing={eksempelRouting}
/>, document.getElementById('app'));
