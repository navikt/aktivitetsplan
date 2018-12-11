import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { injectIntl, intlShape } from 'react-intl';
import PT from 'prop-types';
import { HtmlText } from '../../text';

function EkspanderbartpanelMedTittelOgInnhold({
    tittelId,
    htmlTextId,
    intl,
    ...rest
}) {
    const tittel = intl.formatMessage({
        id: tittelId,
    });

    return (
        <Ekspanderbartpanel tittel={tittel} {...rest}>
            <HtmlText className="mellomrom" id={htmlTextId} />
        </Ekspanderbartpanel>
    );
}

EkspanderbartpanelMedTittelOgInnhold.propTypes = {
    tittelId: PT.string.isRequired,
    htmlTextId: PT.string.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(EkspanderbartpanelMedTittelOgInnhold);
