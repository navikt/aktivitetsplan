import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { autobind } from '../utils';
import Dialog from './dialog';
import Dialoger from './dialoger';
import Modal from '../modal/modal';
import Hovedside from '../sider/hovedside/hovedside';
import history from '../history';
import Lenkeknapp from '../felles-komponenter/utils/lenkeknapp';
import NyHenvendelse from './ny-henvendelse';
import { visibleIfHOC } from '../hocs/visible-if';
import './dialog-modal.less';
import * as AppPT from '../proptypes';

const animationTime = 300;
const width = 600;
const initialLeft = -(width + 10);
const dialogHeight = 250;
const initialDialogMargin = -dialogHeight;
const kolonneStyle = {
    width: `${width / 2}px`
};

const VisibleDiv = visibleIfHOC((props) => <div {...props} />);

function LukkKnapp(props) {
    return <button className="lukk-knapp" {...props} >X</button>;
}

class DialogModalContent extends Component {

    constructor() {
        super();
        autobind(this);
        this.state = {
            dialogPanelMargin: initialDialogMargin
        };
    }

    nyDialog() {
        this.setState({
            dialogPanelMargin: 0
        });
    }

    lukkNyDialog() {
        this.setState({
            dialogPanelMargin: initialDialogMargin
        });
    }

    dialogOpprettet(dialog) {
        this.lukkNyDialog();
        history.push(`/dialog/${dialog.id}`);
    }

    render() {
        const state = this.state;
        const { valgtDialog, valgtAktivitetId, navigerTil } = this.props;
        const { dialogPanelMargin } = state;


        function lukkDialog() {
            history.push('/dialog');
        }

        const nyDialogApen = dialogPanelMargin === 0;
        return (
            <div className="dialog-modal__innhold">
                <div
                    className="dialog-modal__kolonne dialog-modal__kolonne--dialoger"
                    style={kolonneStyle}
                >
                    <div className="dialog-modal__kolonne-header dialog-modal__kolonne-header--dialoger">
                        <Knapp onClick={this.nyDialog} disabled={nyDialogApen}>Ny dialog</Knapp>
                        <LukkKnapp onClick={() => navigerTil('/')} />
                    </div>
                    <div
                        style={{
                            marginTop: `${dialogPanelMargin}px`,
                            transition: `margin-top ${animationTime}ms`
                        }}
                    >
                        <div
                            className="dialog-modal__ny-dialog"
                            style={{
                                minHeight: `${dialogHeight}px`
                            }}
                        >
                            <VisibleDiv visible={nyDialogApen}>
                                <LukkKnapp
                                    onClick={this.lukkNyDialog}
                                />
                                <NyHenvendelse
                                    formNavn="ny-dialog"
                                    onComplete={this.dialogOpprettet} // TODO velg denne dialogen!
                                />
                            </VisibleDiv>
                        </div>
                        <Dialoger className="dialog-modal__kolonne-innhold" valgtDialog={valgtDialog} />
                    </div>
                </div>
                <VisibleDiv
                    visible={!!valgtDialog}
                    className="dialog-modal__kolonne dialog-modal__kolonne--dialog"
                    style={kolonneStyle}
                >
                    <div className="dialog-modal__kolonne-header">
                        <Lenkeknapp
                            visible={!!valgtAktivitetId}
                            onClick={() => navigerTil(`/aktivitet/aktivitet/${valgtAktivitetId}`)}
                        >Gå til aktiviteten</Lenkeknapp>
                        <LukkKnapp onClick={lukkDialog} />
                    </div>
                    <Dialog className="dialog-modal__kolonne-innhold dialog-modal__kolonne-innhold--dialog" dialog={valgtDialog} />
                </VisibleDiv>
            </div>
        );
    }
}

DialogModalContent.propTypes = {
    valgtDialog: AppPT.dialog,
    valgtAktivitetId: PT.string,
    navigerTil: PT.func.isRequired
};

class DialogModal extends Component { // eslint-disable-line react/no-multi-comp

    constructor() {
        super();
        this.state = {
            left: initialLeft
        };
        this.navigerTil = this.navigerTil.bind(this);
    }

    componentDidMount() {
        this.setState({ // eslint-disable-line react/no-did-mount-set-state
            left: 0
        });
    }

    navigerTil(sti) {
        this.setState({
            left: initialLeft
        });
        setTimeout(() => {
            history.push(sti);
        }, animationTime);
    }

    render() {
        const state = this.state || {};
        const { valgtDialog } = this.props;
        return (
            <div>
                <Hovedside />
                <Modal
                    className="dialog-modal"
                    style={{
                        content: {
                            transition: `left ${animationTime}ms, width ${animationTime}ms`,
                            width: `${valgtDialog ? width : width / 2}px`,
                            left: `${state.left}px`
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
    valgtDialog: AppPT.dialog
};

const mapStateToProps = (state, props) => {
    const { routeParams } = props;
    const { id } = routeParams;
    const dialoger = state.data.dialog.data;
    const valgtDialog = dialoger.find((d) => d.id === id);
    const valgtAktivitetId = valgtDialog && valgtDialog.aktivitetId;

    return {
        valgtDialog,
        valgtAktivitetId
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DialogModal);
