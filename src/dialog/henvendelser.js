import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Snakkeboble from 'nav-frontend-snakkeboble';
import { formaterDatoTid, datoComparator } from './../utils';
import * as AppPT from '../proptypes';
import { markerDialogSomLest } from '../ducks/dialog';
import visibleIfHOC from '../hocs/visible-if';
import './henvendelser.less';


function Henvendelse({ henvendelse }) {
    const avsenderVeileder = henvendelse.avsender === 'VEILEDER';
    const ikonCls = (fraVeileder, brukerMann) => classNames('ikon', {
        'ikon--veileder': fraVeileder,
        'ikon--bruker-mann': !fraVeileder && brukerMann,
        'ikon--bruker-kvinne': !fraVeileder && !brukerMann
    });
    return (
        <Snakkeboble
            dato={formaterDatoTid(henvendelse.sendt)}
            tekst={henvendelse.tekst}
            ikonClass={ikonCls(avsenderVeileder, false)}
            pilHoyre={avsenderVeileder}
        />
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
            .sort((a, b) => datoComparator(b.sendt, a.sendt))
            .map((h) => <Henvendelse key={`${h.dialogId}-${h.sendt}`} henvendelse={h} />);
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
