import React from 'react';
import { Sidetittel } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import aktivitetsplanSvg from './aktivitetsplan.svg';
import Bilde from '../../felles-komponenter/bilde/bilde';
import visibleIf from '../../hocs/visible-if';
import Brodsmuler from '../brodsmuler/brodsmuler';

function Sidebanner(props) {
    return (
        <div className="sidebanner-container">
            <div className="sidebanner-grid">
                <Brodsmuler />
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
            </div>
        </div>
    );
}

Sidebanner.propTypes = {
    intl: intlShape.isRequired,
};

export default visibleIf(injectIntl(Sidebanner));
