import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Snakkeboble from 'nav-frontend-snakkeboble';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { selectErVeileder } from '../../identitet/identitet-selector';
import { formaterDatoTid, datoComparator } from '../../../utils';
import * as AppPT from '../../../proptypes';
import Dato from '../../../felles-komponenter/dato';
import visibleIfHOC from '../../../hocs/visible-if';
import hiddenIf from '../../../felles-komponenter/hidden-if/hidden-if';
import { markerDialogSomLest } from '../dialog-reducer';

const LestAvBruker = visibleIfHOC(({ lestAvBrukerTidspunkt }) => (
    <section className="henvendelser__lest-av-bruker">
        <h1 className="typo-undertekst henvendelser__lest-av-bruker--tittel">
            <FormattedMessage id="dialog.lest-av-bruker" />
            <span>&nbsp;</span>
            <Dato visTidspunkt>{lestAvBrukerTidspunkt}</Dato>
        </h1>
    </section>
));

const ikonCls = fraVeileder =>
    classNames('ikon', {
        'ikon--veileder': fraVeileder,
        'ikon--bruker-noytral': !fraVeileder
    });

function Henvendelse({ henvendelse, erPaInnsiden }) {
    const avsenderVeileder = henvendelse.avsender === 'VEILEDER';
    const dato = formaterDatoTid(henvendelse.sendt);
    const visveileder = !!(erPaInnsiden && avsenderVeileder && henvendelse.avsenderId);
    const veileder = avsenderVeileder && henvendelse.avsenderId;

    return (
        <FormattedMessage id="dialog.henvendelse.topp" values={{ visveileder, dato, veileder }}>
            {topptekst => (
                <Snakkeboble topp={topptekst} ikonClass={ikonCls(avsenderVeileder, false)} pilHoyre={avsenderVeileder}>
                    <Tekstomrade>{henvendelse.tekst}</Tekstomrade>
                </Snakkeboble>
            )}
        </FormattedMessage>
    );
}

Henvendelse.propTypes = {
    henvendelse: AppPT.henvendelse,
    erPaInnsiden: PT.bool.isRequired
};

Henvendelse.defaultProps = {
    henvendelse: undefined
};

class Dialog extends Component {
    componentDidMount() {
        const { doMarkerDialogSomLest } = this.props;
        doMarkerDialogSomLest();
    }

    render() {
        const { dialog, erPaInnsiden } = this.props;
        const { henvendelser } = dialog;
        const { lestAvBrukerTidspunkt } = dialog;
        const henvendelserSynkende = [...henvendelser].sort((a, b) => datoComparator(b.sendt, a.sendt));
        const sisteHenvendelseLestAvBruker =
            lestAvBrukerTidspunkt &&
            henvendelserSynkende.find(h => datoComparator(lestAvBrukerTidspunkt, h.sendt) >= 0);

        const henvendelseKomponenter = henvendelserSynkende.map(h => (
            <div key={h.id}>
                <LestAvBruker
                    visible={h === sisteHenvendelseLestAvBruker}
                    lestAvBrukerTidspunkt={lestAvBrukerTidspunkt}
                />
                <Henvendelse key={`${h.dialogId}-${h.sendt}`} henvendelse={h} erPaInnsiden={erPaInnsiden} />
            </div>
        ));
        return <div className="dialog-henvendelser">{henvendelseKomponenter}</div>;
    }
}

Dialog.propTypes = {
    dialog: AppPT.dialog.isRequired,
    erPaInnsiden: PT.bool.isRequired,
    doMarkerDialogSomLest: PT.func.isRequired
};

const mapStateToProps = state => ({
    erPaInnsiden: selectErVeileder(state)
});

const mapDispatchToProps = (dispatch, props) => {
    const { dialog } = props;
    const dialogId = dialog.id;
    return {
        doMarkerDialogSomLest: () => {
            if (!dialog.lest) {
                markerDialogSomLest(dialogId)(dispatch).then(() => {
                    window.dispatchEvent(new Event('aktivitetsplan.dialog.lest'));
                });
            }
        }
    };
};

export default hiddenIf(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Dialog)
);
