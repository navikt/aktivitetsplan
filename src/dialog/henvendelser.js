import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Normaltekst, Infotekst } from 'nav-frontend-typografi';
import * as AppPT from '../proptypes';
import Dato from '../felles-komponenter/dato';
import { markerDialogSomLest } from '../ducks/dialog';
import { visibleIfHOC } from '../hocs/visible-if';

function Henvendelse({ henvendelse }) {
    return (
        <div>
            <Infotekst><Dato>{henvendelse.sendt}</Dato></Infotekst>
            <Normaltekst>{henvendelse.tekst}</Normaltekst>
        </div>
    );
}

Henvendelse.propTypes = {
    henvendelse: AppPT.henvendelse
};

class Dialog extends Component {

    componentDidMount() {
        this.props.doMarkerDialogSomLest();
    }

    componentWillReceiveProps() {
        this.props.doMarkerDialogSomLest();
    }

    render() {
        const { dialog } = this.props;
        return (
            <div>
                {dialog.henvendelser.map((h) => <Henvendelse key={h.id} henvendelse={h} />)}
            </div>
        );
    }
}

Dialog.propTypes = {
    dialog: AppPT.dialog.isRequired,
    doMarkerDialogSomLest: PT.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch, props) => {
    const dialog = props.dialog;
    const dialogId = dialog.id;
    return {
        doMarkerDialogSomLest: () => {
            if (!dialog.lest) {
                markerDialogSomLest(dialogId)(dispatch);
            }
        }
    };
};

export default visibleIfHOC(connect(mapStateToProps, mapDispatchToProps)(Dialog));
