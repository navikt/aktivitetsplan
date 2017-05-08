import React, { Component, PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';
import classNames from 'classnames';
import Dialog from './dialog';
import Dialoger from './dialoger';
import Modal from '../modal/modal';
import Hovedside from '../sider/hovedside/hovedside';
import history from '../history';
import Knappelenke from '../felles-komponenter/utils/knappelenke';
import PilKnapp from '../felles-komponenter/utils/pil-knapp';
import NyHenvendelse from './ny-henvendelse';
import { visibleIfHOC } from '../hocs/visible-if';
import './dialog-modal.less';
import * as AppPT from '../proptypes';

const animationTime = 300;
const breddeEnKolonne = 350;
const breddeToKolonner = 950;

const VisibleDiv = visibleIfHOC((props) => <div {...props} />);


function nyDialog() {
    history.push('/dialog/ny');
}

function tilbake() {
    history.push('/dialog');
}

function dialogOpprettet(dialog) {
    history.push(`/dialog/${dialog.id}`);
}

function DialogModalContent({ valgtDialog, valgtAktivitetId, navigerTil, harNyDialog, harNyDialogEllerValgtDialog }) {
    const harValgtDialog = !!valgtDialog;

    return (
        <div className="dialog-modal__wrapper">
            <div className="dialog-modal__header">
                <PilKnapp visible={harNyDialogEllerValgtDialog} className="dialog-modal__tilbake-knapp" onClick={tilbake} />
                <Undertittel className="dialog-modal__tittel">
                    <FormattedMessage id="dialog.tittel" />
                </Undertittel>
                <Lukknapp overstHjorne onClick={() => navigerTil('/')}>
                    <FormattedMessage id="dialog.modal.lukk-dialog" />
                </Lukknapp>
            </div>
            <div className="dialog-modal__innhold">
                <div className={`dialog-modal__kolonne dialog-modal__kolonne--dialoger ${harNyDialogEllerValgtDialog && 'dialog-modal__kolonne--dialoger-valgt-dialog'}`}>
                    <section className="dialog-modal__ny-dialog">
                        <Knapp
                            onClick={nyDialog}
                            disabled={harNyDialog}
                            className="dialog-modal__ny-dialog-knapp"
                        >
                            <FormattedMessage id="dialog.modal.ny-dialog" />
                        </Knapp>
                    </section>
                    <Dialoger className="dialog-modal__dialoger" valgtDialog={valgtDialog} />
                </div>
                <VisibleDiv
                    visible={harNyDialogEllerValgtDialog}
                    className="dialog-modal__kolonne dialog-modal__kolonne--dialog"
                >
                    <VisibleDiv visible={harNyDialog}>
                        <Undertittel>
                            <FormattedMessage id="dialog.ny-dialog" />
                        </Undertittel>
                        <NyHenvendelse
                            formNavn="ny-dialog"
                            onComplete={dialogOpprettet}
                        />
                    </VisibleDiv>
                    <VisibleDiv visible={harValgtDialog}>
                        <Knappelenke
                            visible={!!valgtAktivitetId}
                            onClick={() => navigerTil(`/aktivitet/aktivitet/${valgtAktivitetId}`)}
                        >
                            <FormattedMessage id="dialog.modal.til-aktiviteten" />
                        </Knappelenke>
                        <Dialog dialog={valgtDialog} />
                    </VisibleDiv>
                </VisibleDiv>
            </div>
        </div>
    );
}

DialogModalContent.propTypes = {
    valgtDialog: AppPT.dialog,
    valgtAktivitetId: PT.string,
    navigerTil: PT.func.isRequired,
    harNyDialog: PT.bool.isRequired,
    harNyDialogEllerValgtDialog: PT.bool.isRequired
};

DialogModalContent.defaultProps = {
    valgtDialog: undefined,
    valgtAktivitetId: undefined
};

class DialogModal extends Component { // eslint-disable-line react/no-multi-comp

    constructor() {
        super();
        this.navigerTil = this.navigerTil.bind(this);
    }

    componentDidMount() {
        this.setState({ // eslint-disable-line react/no-did-mount-set-state
            vis: true
        });
    }

    navigerTil(sti) {
        this.setState({
            vis: false
        });
        setTimeout(() => {
            history.push(sti);
        }, animationTime);
    }

    render() {
        const state = this.state || {};
        const { harNyDialogEllerValgtDialog } = this.props;
        return (
            <div>
                <Hovedside />
                <Modal
                    className={classNames('dialog-modal', state.vis && 'dialog-modal--vis')}
                    style={{
                        content: {
                            transition: `left ${animationTime}ms, width ${animationTime}ms`,
                            width: `${harNyDialogEllerValgtDialog ? breddeToKolonner : breddeEnKolonne}px`
                        }
                    }}
                    isOpen
                    closeButton={false}
                    onRequestClose={() => this.navigerTil('/')}
                >
                    <DialogModalContent navigerTil={this.navigerTil} {...this.props} />
                </Modal>
            </div>
        );
    }
}

DialogModal.propTypes = {
    harNyDialogEllerValgtDialog: PT.bool.isRequired
};

const mapStateToProps = (state, props) => {
    const { routeParams } = props;
    const { id } = routeParams;
    const dialoger = state.data.dialog.data;
    const valgtDialog = dialoger.find((d) => d.id === id);
    const valgtAktivitetId = valgtDialog && valgtDialog.aktivitetId;

    const harNyDialog = id === 'ny';
    const harValgtDialog = !!valgtDialog;
    return {
        harNyDialog,
        valgtDialog,
        harValgtDialog,
        harNyDialogEllerValgtDialog: harNyDialog || valgtDialog,
        valgtAktivitetId
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DialogModal);
