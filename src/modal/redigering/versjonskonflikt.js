import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Bilde } from 'nav-react-design';
import { FormattedMessage } from 'react-intl';
import versjonskonfliktSvg from './versjonskonflikt.svg';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { visibleIfHOC } from '../../hocs/visible-if';
import './versjonskonflikt.less';


function Versjonskonflikt({ tilbake, slett }) {
    return (
        <article className="versjonskonflikt">
            <Bilde src={versjonskonfliktSvg} alt="Dekorativ illustrajon" />
            <Undertittel>
                <FormattedMessage id="versjonskonflikt.overskrift" />
            </Undertittel>
            <Normaltekst>
                <FormattedMessage id="versjonskonflikt.melding" />
            </Normaltekst>
            <div className="versjonskonflikt__knapper">
                <Hovedknapp onClick={tilbake}>
                    <FormattedMessage id="versjonskonflikt.tilbake" />
                </Hovedknapp>
                <Knapp onClick={slett}>
                    <FormattedMessage id="versjonskonflikt.slett" />
                </Knapp>
            </div>
        </article>
    );
}


Versjonskonflikt.propTypes = {
    slett: PT.func.isRequired,
    tilbake: PT.bool.isRequired
};

export default visibleIfHOC(Versjonskonflikt);
