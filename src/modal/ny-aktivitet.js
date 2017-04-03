import React, { PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import { Link } from 'react-router';
import Bilde from 'nav-react-design/dist/bilde';
import Lenkepanel from 'nav-frontend-lenkepanel';
import ModalHeader from './modal-header';
import leggTilAktivitetSvg from '../img/legg-til-aktivitet-illustrasjon.svg';

function ReactRouterLink({ href, children, ...props }) {
    return <Link to={href} {...props} >{children}</Link>;
}
ReactRouterLink.propTypes = {
    href: PT.string.isRequired,
    children: PT.node.isRequired
};

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
                <Lenkepanel href="/aktivitet/ny/stilling" linkCreator={ReactRouterLink}>
                    <FormattedMessage key="stilling" id="ny-aktivitet-modal.ledig-stilling" />
                </Lenkepanel>
                <Lenkepanel href="/aktivitet/ny/egen" linkCreator={ReactRouterLink}>
                    <FormattedMessage key="egen" id="ny-aktivitet-modal.egen-aktivitet" />
                </Lenkepanel>
            </div>
        </ModalHeader>
    );
}

NyAktivitet.propTypes = {};

export default NyAktivitet;
