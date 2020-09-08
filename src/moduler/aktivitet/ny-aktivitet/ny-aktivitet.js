import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { hentIdentitet } from '../../identitet/identitet-reducer';
import Lenkepanel from '../../../felles-komponenter/lenkepanel';
import Modal from '../../../felles-komponenter/modal/modal';
import { selectErVeileder } from '../../identitet/identitet-selector';
import { selectAktivitetFeilmeldinger } from '../aktivitet-selector';
import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';

class NyAktivitet extends Component {
    componentDidMount() {
        const { doHentIdentitet } = this.props;
        doHentIdentitet();
    }

    render() {
        const { erVeileder, aktivitetFeilmeldinger } = this.props;
        return (
            <Modal
                contentLabel="ny-aktivitet-modal"
                contentClass="ny-aktivitet-visning"
                feilmeldinger={aktivitetFeilmeldinger}
            >
                <div className="ny-aktivitet-modal__header">
                    <Normaltekst className={'ny-aktivitet-modal__hjelpetekst'} hidden={erVeileder}>
                        Her kan du legge til ulike aktiviteter du gjør for å nå målet ditt.
                    </Normaltekst>

                    <div className="ny-aktivitet-modal__tittel-boks">
                        <Innholdstittel className="ny-aktivitet-tittel">
                            <FormattedMessage id="ny-aktivitet-modal.tittel" />
                        </Innholdstittel>

                        <EtikettBase className={'ny-aktivitet-modal__etikett'} hidden={!erVeileder}>
                            FOR NAV-ANSATT
                        </EtikettBase>
                    </div>
                </div>
                <div hidden={!erVeileder} className="ny-aktivitet-modal__ny-aktivitet-lenker">
                    <Lenkepanel border href="/aktivitet/ny/sokeavtale" hidden={!erVeileder}>
                        <FormattedMessage id="ny-aktivitet-modal.sokeavtale-aktivitet" />
                    </Lenkepanel>
                    <Lenkepanel border href="/aktivitet/ny/behandling" hidden={!erVeileder}>
                        <FormattedMessage id="ny-aktivitet-modal.medisinsk-behandling" />
                    </Lenkepanel>
                    <Lenkepanel border href="/aktivitet/ny/mote" hidden={!erVeileder}>
                        <FormattedMessage id="ny-aktivitet-modal.mote" />
                    </Lenkepanel>
                    <Lenkepanel border href="/aktivitet/ny/samtalereferat" hidden={!erVeileder}>
                        <FormattedMessage id="ny-aktivitet-modal.samtalereferat" />
                    </Lenkepanel>
                </div>

                <hr hidden={!erVeileder} className="ny-aktivitet-modal__veileder-skille" />
                <div className="ny-aktivitet-modal__ny-aktivitet-lenker">
                    <div className="ny-aktivitet-modal__etikett-bruker">
                        <EtikettBase className={'ny-aktivitet-modal__etikett'} hidden={!erVeileder}>
                            FOR BRUKER OG NAV-ANSATT
                        </EtikettBase>
                    </div>

                    <Lenkepanel border href="/aktivitet/ny/stilling">
                        <FormattedMessage id="ny-aktivitet-modal.ledig-stilling" />
                    </Lenkepanel>

                    <Lenkepanel border href="/aktivitet/ny/ijobb">
                        <FormattedMessage id="ny-aktivitet-modal.jobb-jeg-er-i" />
                    </Lenkepanel>
                    <Lenkepanel border href="/aktivitet/ny/egen">
                        <FormattedMessage id="ny-aktivitet-modal.egen-aktivitet" />
                    </Lenkepanel>
                </div>
            </Modal>
        );
    }
}

NyAktivitet.propTypes = {
    doHentIdentitet: PT.func.isRequired,
    erVeileder: PT.bool.isRequired,
    aktivitetFeilmeldinger: PT.array.isRequired,
};

const mapStateToProps = (state) => ({
    erVeileder: selectErVeileder(state),
    aktivitetFeilmeldinger: selectAktivitetFeilmeldinger(state),
});

const mapDispatchToProps = (dispatch) => ({
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NyAktivitet);
