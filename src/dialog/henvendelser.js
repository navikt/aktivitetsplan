import React, { Component, PropTypes as PT } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import * as AppPT from '../proptypes';
import Dato from '../felles-komponenter/dato';
import { markerDialogSomLest } from '../ducks/dialog';
import { visibleIfHOC } from '../hocs/visible-if';


const henvendelseCls = (hoyre) => classNames('henvendelse', {
    'henvendelse--hoyre': hoyre, 'henvendelse--venstre': !hoyre
});

const henvendelsePilCls = (hoyre) => classNames('henvendelse__snakkebole-pil', {
    'henvendelse__snakkebole-pil--hoyre': hoyre,
    'henvendelse__snakkebole-pil--venstre': !hoyre
});

const henvendelseIkonCls = (fraVeileder) => classNames('henvendelse__ikon', {
    'henvendelse__ikon--veileder': fraVeileder,
    'henvendelse__ikon--bruker': !fraVeileder
});

const henvendelsePanelCls = (hoyre) => classNames('henvendelse__panel henvendelse-panel', {
    'hoyrejustert-tekst': hoyre
});

function Henvendelse({ henvendelse }) {
    const avsenderVeileder = henvendelse.avsender === 'VEILEDER';
    return (
        <div className={henvendelseCls(avsenderVeileder)}>
            <i className={henvendelseIkonCls(avsenderVeileder)} />
            <div className="henvendelse__snakkeboble-pil-container">
                <i className={henvendelsePilCls(avsenderVeileder)} />
            </div>
            <Panel className={henvendelsePanelCls(avsenderVeileder)}>
                <Undertekst className="henvendelse-panel__dato"><Dato>{henvendelse.sendt}</Dato></Undertekst>
                <Normaltekst className="henvendelse-panel__tekst">{henvendelse.tekst}</Normaltekst>
            </Panel>
        </div>
    );
}

Henvendelse.propTypes = {
    henvendelse: AppPT.henvendelse
};

Henvendelse.defaultProps = {
    henvendelse: undefined
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
        const henvendelser = [...dialog.henvendelser]
            .sort((a, b) => b.sendt - a.sendt)
            .map((h) => <Henvendelse key={h.id} henvendelse={h} />);
        return <div className="dialog-henvendelser">{henvendelser}</div>;
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
