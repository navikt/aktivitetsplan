import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import Modal from '../../felles-komponenter/modal/modal';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import { HtmlText } from '../../text';
import Ekspanderbartpanel from '../../felles-komponenter/utils/ekspanderbartpanel-med-tittel-og-innhold';
import Video from './video';

function InformasjonModal() {
    return (
        <Modal
            contentLabel="informasjon-modal"
            contentClass="informasjon-visning"
        >
            <ModalContainer className="informasjon-modal-container">
                <Innholdstittel>
                    <FormattedMessage id="informasjon.tittel" />
                </Innholdstittel>
                <HtmlText className="mellomrom" id="informasjon.hjelpetekst" />
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

export default InformasjonModal;
