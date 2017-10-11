import React from 'react';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { selectErUnderOppfolging } from './moduler/situasjon/situasjon-selector';
import hiddenIf from './felles-komponenter/hidden-if/hidden-if';

const mapStateToProps = state => ({
    underOppfolging: selectErUnderOppfolging(state),
});

function textHOC(Component) {
    // eslint-disable-next-line react/prop-types
    function Text({ id, children, ...rest }) {
        return (
            <Component id={id} values={rest}>
                {children}
            </Component>
        );
    }

    return hiddenIf(connect(mapStateToProps)(Text));
}

export default textHOC(FormattedMessage);
export const HtmlText = textHOC(FormattedHTMLMessage);
