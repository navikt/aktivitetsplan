import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import Bilde from 'nav-react-design/dist/bilde';
import Lenkepanel from '../felles-komponenter/lenkepanel';
import ModalHeader from './modal-header';
import leggTilAktivitetSvg from '../img/legg-til-aktivitet-illustrasjon.svg';
import StandardModal from './modal-standard';

function NyAktivitet() {
    return (
        <StandardModal name="nyAktivitetModal">
            <ModalHeader className="ny-aktivitet-modal side-innhold">
                <div className="ny-aktivitet-modal__header">
                    <Bilde className="ny-aktivitet-modal__bilde" src={leggTilAktivitetSvg} alt="Dekorativ illustrajon" />
                    <Innholdstittel className="ny-aktivitet-tittel">
                        <FormattedMessage id="ny-aktivitet-modal.tittel" />
                    </Innholdstittel>
                </div>
                <div className="ny-aktivitet-modal__ny-aktivitet-lenker">
                    <Lenkepanel href="/aktivitet/ny/stilling">
                        <FormattedMessage id="ny-aktivitet-modal.ledig-stilling" />
                    </Lenkepanel>
                    <Lenkepanel href="/aktivitet/ny/egen">
                        <FormattedMessage id="ny-aktivitet-modal.egen-aktivitet" />
                    </Lenkepanel>
                </div>
            </ModalHeader>
        </StandardModal>
    );
}

export default NyAktivitet;
