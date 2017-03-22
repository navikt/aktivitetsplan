import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Bilde from 'nav-react-design/dist/bilde';
import Lenkepanel from '../felles-komponenter/utils/lenkepanel';
import ModalHeader from './modal-header';
import leggTilAktivitetSvg from '../img/legg-til-aktivitet-illustrasjon.svg';

function NyAktivitet() {
    return (
        <ModalHeader className="ny-aktivitet-modal side-innhold">
            <div className="ny-aktivitet-modal__header">
                <Bilde className="ny-aktivitet-modal__bilde" src={leggTilAktivitetSvg} alt="Dekorativ illustrajon" />
                <Innholdstittel className="ny-aktivitet-tittel">
                    <FormattedMessage id="ny-aktivitet-modal.tittel" />
                </Innholdstittel>
            </div>
            <div className="ny-aktivitet-modal__ny-aktivitet-lenker">
                <Lenkepanel url="/aktivitet/ny/stilling">
                    <Undertittel className="lenketekst">
                        <FormattedMessage id="ny-aktivitet-modal.ledig-stilling" />
                    </Undertittel>
                </Lenkepanel>
                <Lenkepanel url="/aktivitet/ny/egen">
                    <Undertittel className="lenketekst">
                        <FormattedMessage id="ny-aktivitet-modal.egen-aktivitet" />
                    </Undertittel>
                </Lenkepanel>
            </div>
        </ModalHeader>
    );
}

NyAktivitet.propTypes = {};

export default NyAktivitet;
