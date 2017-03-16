import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertittel } from 'nav-react-design/dist/typografi';
import Bilde from 'nav-react-design/dist/bilde';
import Lenke from '../../felles-komponenter/lenke';
import Lenkepanel from '../../felles-komponenter/lenkepanel';
import ModalHeader from '../../felles-komponenter/modal-header';

function NyAktivitet() {
    return (
        <ModalHeader className="ny-aktivitet-modal side-innhold">
            <div className="ny-aktivitet-modal__header">
                <Bilde className="ny-aktivitet-modal__bilde" src="/aktivitetsplan/img/legg-til-aktivitet-illustrasjon.svg" alt="Dekorativ illustrajon" />
                <Innholdstittel className="ny-aktivitet-tittel">
                    <FormattedMessage id="ny-aktivitet-modal.tittel" />
                </Innholdstittel>
            </div>
            <div className="ny-aktivitet-modal__ny-aktivitet-lenker">
                <Lenkepanel url="/aktiviter/ny/stilling">
                    <Undertittel className="lenketekst">
                        <FormattedMessage id="ny-aktivitet-modal.ledig-stilling" />
                    </Undertittel>
                </Lenkepanel>
                <Lenkepanel url="/aktiviter/ny/egen">
                    <Undertittel className="lenketekst">
                        <FormattedMessage id="ny-aktivitet-modal.egen-aktivitet" />
                    </Undertittel>
                </Lenkepanel>
            </div>
            <span className="ny-aktivitet-modal__linje"><hr /></span>
            <div className="ny-aktivitet-modal__info-lenker">
                <Lenke href="/">Se ledige stillinger fra NAV sitt stillingsøk</Lenke>
                <Lenke href="/">Se ledige stillinger fra FINN</Lenke>
                <Lenke href="/">Se våre tips til aktiviteter for jobbsøkere</Lenke>
            </div>
        </ModalHeader>
    );
}

NyAktivitet.propTypes = {};

export default NyAktivitet;
