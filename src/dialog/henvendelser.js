import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Snakkeboble from 'nav-frontend-snakkeboble';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { formaterDatoTid, datoComparator } from './../utils';
import * as AppPT from '../proptypes';
import Dato from '../felles-komponenter/dato';
import { markerDialogSomLest } from '../ducks/dialog';
import visibleIfHOC from '../hocs/visible-if';

const LestAvBruker = visibleIfHOC(({ lestAvBrukerTidspunkt }) =>
    <div className="henvendelser__lest-av-bruker">
        <FormattedMessage id="dialog.lest-av-bruker" />
        <span>&nbsp;</span>
        <Dato visTidspunkt>
            {lestAvBrukerTidspunkt}
        </Dato>
    </div>
);

function Henvendelse({ henvendelse }) {
    const avsenderVeileder = henvendelse.avsender === 'VEILEDER';
    const ikonCls = (fraVeileder, brukerMann) =>
        classNames('ikon', {
            'ikon--veileder': fraVeileder,
            'ikon--bruker-mann': !fraVeileder && brukerMann,
            'ikon--bruker-kvinne': !fraVeileder && !brukerMann,
        });
    return (
        <Snakkeboble
            dato={formaterDatoTid(henvendelse.sendt)}
            ikonClass={ikonCls(avsenderVeileder, false)}
            pilHoyre={avsenderVeileder}
        >
            <Tekstomrade>
                {henvendelse.tekst}
            </Tekstomrade>
        </Snakkeboble>
    );
}

Henvendelse.propTypes = {
    henvendelse: AppPT.henvendelse,
};

Henvendelse.defaultProps = {
    henvendelse: undefined,
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
        const henvendelser = dialog.henvendelser;
        const lestAvBrukerTidspunkt = dialog.lestAvBrukerTidspunkt;
        const henvendelserSynkende = [...henvendelser].sort((a, b) =>
            datoComparator(b.sendt, a.sendt)
        );
        const sisteHenvendelseLestAvBruker =
            lestAvBrukerTidspunkt &&
            henvendelserSynkende.find(
                h => datoComparator(lestAvBrukerTidspunkt, h.sendt) >= 0
            );

        const henvendelseKomponenter = henvendelserSynkende.map(h =>
            <div>
                <LestAvBruker
                    visible={h === sisteHenvendelseLestAvBruker}
                    lestAvBrukerTidspunkt={lestAvBrukerTidspunkt}
                />
                <Henvendelse key={`${h.dialogId}-${h.sendt}`} henvendelse={h} />
            </div>
        );
        return (
            <div className="dialog-henvendelser">
                {henvendelseKomponenter}
            </div>
        );
    }
}

Dialog.propTypes = {
    dialog: AppPT.dialog.isRequired,
    doMarkerDialogSomLest: PT.func.isRequired,
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
        },
    };
};

export default visibleIfHOC(
    connect(mapStateToProps, mapDispatchToProps)(Dialog)
);
