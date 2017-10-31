import React from 'react';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import hiddenIf from './felles-komponenter/hidden-if/hidden-if';
import Innholdslaster from './felles-komponenter/utils/innholdslaster';
import {
    selectErUnderOppfolging,
    selectOppfolgingStatus,
} from './moduler/oppfolging-status/oppfolging-selector';

const mapStateToProps = state => ({
    avhengigheter: [selectOppfolgingStatus(state)],
    underOppfolging: selectErUnderOppfolging(state),
});

function textHOC(Component, props) {
    const { visChildrenVedFeil } = props || {};
    // eslint-disable-next-line react/prop-types
    function Text({ id, children, avhengigheter, ...rest }) {
        return (
            <Innholdslaster
                avhengigheter={avhengigheter}
                visChildrenVedFeil={visChildrenVedFeil}
            >
                <Component id={id} values={rest}>
                    {children}
                </Component>
            </Innholdslaster>
        );
    }

    return hiddenIf(connect(mapStateToProps)(Text));
}

export default textHOC(FormattedMessage);
export const HtmlText = textHOC(FormattedHTMLMessage);
export const FailsafeText = textHOC(FormattedHTMLMessage, {
    visChildrenVedFeil: true,
});
