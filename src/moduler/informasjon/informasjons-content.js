import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Ekspanderbartpanel from '../../felles-komponenter/utils/ekspanderbartpanel-med-tittel-og-innhold';
import { HtmlText } from '../../text';
import Video from './video';
import ModalContainer from '../../felles-komponenter/modal/modal-container';

export default function InformasjonsContent() {
    return (
        <ModalContainer className="informasjon-modal-container">
            <Innholdstittel>
                <FormattedMessage id="informasjon.ny_tittel" />
            </Innholdstittel>
            <HtmlText className="mellomrom" id="informasjon.ny_hjelpetekst" />
            <Video />
            <Ekspanderbartpanel
                tittelId="informasjon.tittel.seksjon.bruk"
                htmlTextId="informasjon.informasjonstekst.seksjon.bruk"
                border
            />

            <Ekspanderbartpanel
                tittelId="informasjon.tittel.seksjon.ytelser"
                htmlTextId="informasjon.informasjonstekst.seksjon.ytelser"
                border
            />

            <Ekspanderbartpanel
                tittelId="informasjon.tittel.seksjon.meldekort"
                htmlTextId="informasjon.informasjonstekst.seksjon.meldekort"
                border
            />

            <Ekspanderbartpanel
                tittelId="informasjon.tittel.seksjon.personvern"
                htmlTextId="informasjon.informasjonstekst.seksjon.personvern"
                border
            />
        </ModalContainer>
    );
}
