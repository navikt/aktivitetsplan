import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import { hentIdentitet } from '../../identitet/identitet-reducer';
import Lenkepanel from '../../../felles-komponenter/lenkepanel';
import LeggTilIcon from './legg-til-ikon';
import Modal from '../../../felles-komponenter/modal/modal';
import { selectErVeileder } from '../../identitet/identitet-selector';
import { selectAktivitetFeilmeldinger } from '../aktivitet-selector';

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
                    <LeggTilIcon />
                    <Innholdstittel className="ny-aktivitet-tittel">
                        <FormattedMessage id="ny-aktivitet-modal.tittel" />
                    </Innholdstittel>
                </div>
                <div className="ny-aktivitet-modal__ny-aktivitet-lenker">
                    <Lenkepanel border href="/aktivitet/ny/sokeavtale" hidden={!erVeileder}>
                        <FormattedMessage id="ny-aktivitet-modal.sokeavtale-aktivitet" />
                    </Lenkepanel>
                    <Lenkepanel border href="/aktivitet/ny/behandling" hidden={!erVeileder}>
                        <FormattedMessage id="ny-aktivitet-modal.medisinsk-behandling" />
                    </Lenkepanel>
                    <Lenkepanel border href="/aktivitet/ny/mote" hidden={!erVeileder}>
                        <FormattedMessage id="ny-aktivitet-modal.mote" />
                    </Lenkepanel>
                    <Lenkepanel
                        border
                        href="/aktivitet/ny/samtalereferat"
                        hidden={!erVeileder}
                        className="ny-aktivitet-modal__veileder-skille"
                    >
                        <FormattedMessage id="ny-aktivitet-modal.samtalereferat" />
                    </Lenkepanel>

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
