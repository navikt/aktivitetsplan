import React from 'react';
import PT from 'prop-types';

function Brodsmule({ skalVises, path, tekst }) {
    if (!skalVises) {
        return null;
    }
    const tekstEllerLink = path
        ? <a href={path} className="lenke">
              {`${tekst}`}
          </a>
        : tekst;

    return (
        <li className="brodsmuler__item typo-normal">
            {tekstEllerLink}
        </li>
    );
}

Brodsmule.propTypes = {
    tekst: PT.string.isRequired,
    skalVises: PT.bool,
    path: PT.string,
};

Brodsmule.defaultProps = {
    skalVises: true,
    path: undefined,
};

export default Brodsmule;
