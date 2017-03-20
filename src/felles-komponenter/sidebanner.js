import React from 'react';
import { Bilde } from 'nav-react-design';
import { Sidetittel, Normaltekst } from 'nav-react-design/dist/typografi';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import aktivitetsplanSvg from '../img/aktivitetsplan.svg';

function Sidebanner() {
    return (
        <div className="sidebanner">
            <div className="sidebanner__container">
                <Normaltekst> Ditt nav / Veien din til jobb / Aktivitetsplan</Normaltekst>
                <div className="sidebanner__tittel-container">
                    <div className="sidebanner__tittel-tekst">
                        <Sidetittel className="sidebanner__tittel">
                            <FormattedMessage id="hovedside.tittel" />
                        </Sidetittel>
                        <FormattedHTMLMessage id="hovedside.ingress" />
                    </div>
                    <Bilde
                        src={aktivitetsplanSvg}
                        alt="Illustrasjon"
                        className="sidebanner__illustrasjon"
                    />
                </div>
            </div>
        </div>
    );
}

Sidebanner.propTypes = {};

export default Sidebanner;
