import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { erInternlenke } from './../utils';
import { OppChevron, NedChevron, HoyreChevron } from './chevron';

const cls = (className) => classNames('lenkepanel', className);

const chevron = (valgt, accordionPil) => {
    if (accordionPil) {
        if (valgt) {
            return <NedChevron />;
        }
        return <OppChevron />;
    }
    return <HoyreChevron />;
};

function Lenkepanel({ url, children, className, pil, onClick }) {
    const { accordion, valgt } = pil;
    if (erInternlenke(url)) {
        return (
            <Link to={url} className={cls(className)} onClick={onClick}>
                {children}
                {chevron(valgt, accordion)}
            </Link>
        );
    }
    return (
        <a href={url} className={cls(className)}>
            {children}
            {chevron(valgt, accordion)}
        </a>
    );
}

Lenkepanel.defaultProps = {
    pil: { accordion: false }
};
Lenkepanel.propTypes = {
    url: PT.string.isRequired,
    children: PT.node.isRequired,
    pil: PT.shape({
        accordion: PT.bool.isRequired,
        valgt: PT.bool
    }),
    onClick: PT.func,
    className: PT.string
};

export default Lenkepanel;
