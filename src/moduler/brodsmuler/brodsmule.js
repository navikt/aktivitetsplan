import React from 'react';
import PT from 'prop-types';

function Brodsmule(props) {
    if (!props.skalVises) {
        return null;
    }
    const tekstEllerLink = props.path ?
        <a href={props.path} className="lenke"> {props.tekst} </a>
        : props.tekst;

    return (
        <li className="brodsmuler__item typo-normal">
            {tekstEllerLink}
        </li>
    );

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
    path: undefined,
};

export default Brodsmule;
