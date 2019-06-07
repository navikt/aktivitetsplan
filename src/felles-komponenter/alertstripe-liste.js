import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Listevisning from './listevisning';
import { HiddenIfAlertStripeInfoSolid } from './hidden-if/hidden-if-alertstriper';

function AlertstripeListe({
    config,
    hidden,
    nopadding,
    nobullets,
    children,
    ...props
}) {
    const listeelementer = Object.entries(config)
        .filter(([, value]) => value)
        .map(([key]) =>
            <li key={key}>
                <FormattedMessage id={key} />
            </li>
        );

    const harIngenElementer = listeelementer.length === 0;

    return (
        <HiddenIfAlertStripeInfoSolid
            hidden={hidden || harIngenElementer}
            {...props}
        >
            {children}
            <Listevisning nopadding={nopadding} nobullets={nobullets}>
                {listeelementer}
            </Listevisning>
        </HiddenIfAlertStripeInfoSolid>
    );
}

AlertstripeListe.propTypes = {
    children: PT.oneOfType([PT.node, PT.arrayOf(PT.node)]),
    hidden: PT.bool,
    nopadding: PT.bool,
    nobullets: PT.bool,
    config: PT.object.isRequired,
};
AlertstripeListe.defaultProps = {
    children: null,
    nopadding: true,
    nobullets: true,
    hidden: false,
};

export default AlertstripeListe;
