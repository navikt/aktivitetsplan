import React from 'react';
import { Sidetittel } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import aktivitetsplanSvg from './aktivitetsplan.svg';
import Bilde from '../../felles-komponenter/bilde/bilde';
import visibleIf from '../../hocs/visible-if';

function Sidebanner(props) {
    return (
        <div className="sidebanner">
            <Bilde
                src={aktivitetsplanSvg}
                alt={props.intl.formatMessage({
                    id: 'sidebanner-illustrasjon.alt-tekst',
                })}
                className="sidebanner__illustrasjon"
            />
            <Sidetittel className="sidebanner__tittel">
                <FormattedMessage id="hovedside.tittel" />
            </Sidetittel>
        </div>
    );
}

Sidebanner.propTypes = {
    intl: intlShape.isRequired,
};

export default visibleIf(injectIntl(Sidebanner));
