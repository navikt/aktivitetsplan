import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {Route, IndexRoute} from "react-router";
import {hentAktiviteter} from '../src/ducks/aktiviteter';
import ReactModal from 'react-modal';
import '../src/index.less';
import history from '../src/history';
import App from '../src/app';
import aktivitetsplanRouting from '../src/routing';

function TomPlan() {
    return <div/>
}

class Application extends Component {

    constructor({doHentAktiviteter}) {
        super();
        ReactModal.setAppElement('#modal-a11y-wrapper');
        document.addEventListener('flate-person-endret', (event) => {
            if (event.personnummer) {
                doHentAktiviteter();
            }
            history.push("/");
        });
    }

    render() {
        const {children} = this.props;
        return (
            <div className="aktivitetsplan">
                {children}
            </div>
        );
    }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
    doHentAktiviteter: () => hentAktiviteter()(dispatch)
});
const ApplicationConnected = connect(mapStateToProps, mapDispatchToProps)(Application);

const routing = (
    <Route>
        <IndexRoute component={TomPlan}/>
        <Route path=":fnr">
            {aktivitetsplanRouting}
        </Route>
    </Route>
);

function AktivitetsplanRoot() {
    return <App
        applicationComponent={ApplicationConnected}
        routing={routing}
    />
}

export default AktivitetsplanRoot;


render(<AktivitetsplanRoot/>, document.getElementById('app'));
