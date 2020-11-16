import classNames from 'classnames';
import PT from 'prop-types';
import React from 'react';

const cls = (className, nopadding, nobullets) =>
    classNames('listevisning', {
        nopadding,
        nobullets,
    });

function Listevisning({ nopadding, nobullets, className, children }) {
    return <ul className={cls(className, nopadding, nobullets)}>{children}</ul>;
}

Listevisning.propTypes = {
    nopadding: PT.bool,
    nobullets: PT.bool,
    className: PT.string,
    children: PT.oneOfType([PT.node, PT.arrayOf(PT.node)]).isRequired,
};
Listevisning.defaultProps = {
    nopadding: true,
    nobullets: true,
    className: null,
};

export default Listevisning;
