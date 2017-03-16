import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';

const cls = (orientasjon, className) => classNames('chevronboks', className, {
    'chevron--hoyre': orientasjon === 'høyre',
    'chevron--venstre': orientasjon === 'venstre',
    'chevron--ned': orientasjon === 'ned',
    'chevron--opp': orientasjon === 'opp'
});

function Chevron({ orientasjon, className, ...props }) {
    return (
        <i className={cls(orientasjon, className)} {...props} />
    );
}

Chevron.defaultProps = {
    orientasjon: 'høyre'
};

Chevron.propTypes = {
    orientasjon: PT.oneOf(['høyre', 'venstre', 'opp', 'ned']),
    className: PT.string
};

export default Chevron;

export const HoyreChevron = (props) => <Chevron orientasjon="høyre" {...props} />;
export const VenstreChevron = (props) => <Chevron orientasjon="venstre" {...props} />;
export const OppChevron = (props) => <Chevron orientasjon="opp" {...props} />;
export const NedChevron = (props) => <Chevron orientasjon="ned" {...props} />;
