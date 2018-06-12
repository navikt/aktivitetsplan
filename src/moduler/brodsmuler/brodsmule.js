import React from 'react';
import PT from 'prop-types';

function Brodsmule(props) {
    if (!props.skalVises) {
        return null;
    }
    return props.erGjeldendeSmule
        ? <li className="brodsmuler__item typo-normal">
              {props.tekst}
          </li>
        : <li className="brodsmuler__item typo-normal">
              <a href={props.path} className="lenke">
                  {props.tekst}
              </a>
          </li>;
}

Brodsmule.propTypes = {
    tekst: PT.string.isRequired,
    skalVises: PT.bool,
    erGjeldendeSmule: PT.bool,
    path: PT.string,
};

Brodsmule.defaultProps = {
    skalVises: true,
    erGjeldendeSmule: false,
    path: '/',
};

export default Brodsmule;
