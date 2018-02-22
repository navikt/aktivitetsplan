import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import hiddenIf from './felles-komponenter/hidden-if/hidden-if';
import Innholdslaster from './felles-komponenter/utils/innholdslaster';
import {
    selectErUnderOppfolging,
    selectOppfolgingStatus,
} from './moduler/oppfolging-status/oppfolging-selector';
import {
    selectErVeileder,
    selectIdentitetStatus,
} from './moduler/identitet/identitet-selector';

const mapStateToProps = state => ({
    avhengigheter: [
        selectOppfolgingStatus(state),
        selectIdentitetStatus(state),
    ],
    underOppfolging: selectErUnderOppfolging(state),
    erVeileder: selectErVeileder(state),
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

function FormattedHTMLMessageProxy({ id, values }) {
    const { className, ...restValues } = values;
    return (
        <FormattedHTMLMessage id={id} values={restValues}>
            {content =>
                <div
                    className={className}
                    dangerouslySetInnerHTML={{ __html: content }} // eslint-disable-line react/no-danger
                />}
        </FormattedHTMLMessage>
    );
}

FormattedHTMLMessageProxy.propTypes = {
    id: PT.string.isRequired,
    values: PT.object.isRequired,
};

export default textHOC(FormattedMessage);
export const HtmlText = textHOC(FormattedHTMLMessageProxy);
export const FailsafeText = textHOC(FormattedHTMLMessage, {
    visChildrenVedFeil: true,
});
