import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from 'prop-types';

import hiddenIf from './felles-komponenter/hidden-if/hidden-if';
import Innholdslaster from './felles-komponenter/utils/innholdslaster';
import { selectOppfolgingStatus } from './moduler/oppfolging-status/oppfolging-selector';
import { selectIdentitetStatus } from './moduler/identitet/identitet-selector';

const mapStateToProps = (state) => ({
    avhengigheter: [selectOppfolgingStatus(state), selectIdentitetStatus(state)],
});

function FailsafeText({ id, avhengigheter, visTekstVedFeil, ...rest }) {
    return (
        <Innholdslaster avhengigheter={avhengigheter} visChildrenVedFeil={visTekstVedFeil}>
            <FormattedMessage id={id} values={rest} />
        </Innholdslaster>
    );
}

FailsafeText.propTypes = {
    id: AppPT.string.isRequired,
    avhengigheter: AppPT.array.isRequired,
    visTekstVedFeil: AppPT.bool,
};

FailsafeText.defaultProps = {
    visTekstVedFeil: false,
};

export default hiddenIf(connect(mapStateToProps)(FailsafeText));
