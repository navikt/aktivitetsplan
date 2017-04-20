import React, { PropTypes as PT } from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { visibleIfHOC } from '../../hocs/visible-if';

function BegrunnelseBoks({ begrunnelse }) {
    return (
        <div className="begrunnelse-boks">
            <AlertStripeInfo>
                {begrunnelse}
            </AlertStripeInfo>
        </div>
    );
}

BegrunnelseBoks.propTypes = {
    begrunnelse: PT.string.isRequired
};

export default visibleIfHOC(BegrunnelseBoks);
