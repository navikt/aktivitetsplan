import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import PT from 'prop-types';
import Modal from '../../felles-komponenter/modal/modal';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import { HtmlText } from '../../text';
import Ekspanderbartpanel from '../../felles-komponenter/utils/ekspanderbartpanel-med-tittel-og-innhold';
import Video from './video';
import { selectLestInformasjon } from '../lest/lest-reducer';
import * as Api from './../lest/lest-api';
import { selectErBruker } from '../identitet/identitet-selector';
import * as AppPT from '../../proptypes';

export const INFORMASJON_MODAL_VERSJON = 'v1';

class InformasjonModal extends Component {
    componentWillMount() {
        const { erBruker, lestInfo } = this.props;

        if (erBruker && lestInfo.verdi !== INFORMASJON_MODAL_VERSJON) {
            Api.lesInformasjon(INFORMASJON_MODAL_VERSJON);
        }
    }

    render() {
        return (
            <Modal
                contentLabel="informasjon-modal"
                contentClass="informasjon-visning"
            >
                <ModalContainer className="informasjon-modal-container">
                    <Innholdstittel>
                        <FormattedMessage id="informasjon.ny_tittel" />
                    </Innholdstittel>
                    <HtmlText
                        className="mellomrom"
                        id="informasjon.ny_hjelpetekst"
                    />
                    <Video />
                    <Ekspanderbartpanel
                        tittelId="informasjon.tittel.seksjon.1"
                        htmlTextId="informasjon.informasjonstekst.seksjon.1"
                        border
                    />

                    <Ekspanderbartpanel
                        tittelId="informasjon.tittel.seksjon.2"
                        htmlTextId="informasjon.informasjonstekst.seksjon.2"
                        border
                    />

                    <Ekspanderbartpanel
                        tittelId="informasjon.tittel.seksjon.3"
                        htmlTextId="informasjon.informasjonstekst.seksjon.3"
                        border
                    />

                    <Ekspanderbartpanel
                        tittelId="informasjon.tittel.seksjon.4"
                        htmlTextId="informasjon.informasjonstekst.seksjon.4"
                        border
                    />
                </ModalContainer>
            </Modal>
        );
    }
}

InformasjonModal.propTypes = {
    erBruker: PT.bool.isRequired,
    lestInfo: AppPT.lest.isRequired,
};

const mapStateToProps = state => ({
    lestInfo: selectLestInformasjon(state),
    erBruker: selectErBruker(state),
});

export default connect(mapStateToProps)(InformasjonModal);
