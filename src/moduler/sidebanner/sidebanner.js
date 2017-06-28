import React from 'react';
import { Bilde } from 'nav-react-design';
import { Sidetittel } from 'nav-react-design/dist/typografi';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import aktivitetsplanSvg from './aktivitetsplan.svg';
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
