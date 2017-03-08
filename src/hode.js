import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';

const cls = (className, props) => classNames('hode', {
    'hode-dekorert': props.dekorert,
    'hode-innholdstittel': props.type === 'innholdstittel',
    'hode-undertittel': props.type === 'undertittel',
    'hode-suksess': props.suksess,
    'hode-advarsel': props.advarsel,
    'hode-feil': props.feil
}, className);

function Hode({ tagName, className, children, ...props }) {
    const classnames = { className: cls(className, props) };
    return React.createElement(tagName, { ...props, ...classnames }, children);
}

Hode.defaultProps = {
    tagName: 'h1'
};

Hode.propTypes = {
    tagName: PT.string,
    className: PT.string,
    type: PT.oneOf(['innholdstittel', 'undertittel']),
    dekorert: PT.bool,
    suksess: PT.bool,
    advarsel: PT.bool,
    feil: PT.bool,
    children: PT.node.isRequired
};

export default Hode;
export const StandardHode = (props) => <Hode dekorert {...props} />;
export const SuksessHode = (props) => <Hode dekorert suksess {...props} />;
export const AdvarselHode = (props) => <Hode dekorert advarsel {...props} />;
export const FeilHode = (props) => <Hode dekorert feil {...props} />;
