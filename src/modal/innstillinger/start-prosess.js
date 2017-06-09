import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';

const cls = classes => classNames('start-prosess', classes);

function Prosess({ tittel, tekst, knappetekst, onClick, className }) {
    return (
        <article className={cls(className)}>
            <Undertittel>{tittel}</Undertittel>
            <div className="blokk-xs">
                <Normaltekst>{tekst}</Normaltekst>
            </div>
            <Knapp mini onClick={onClick}>{knappetekst}</Knapp>
        </article>
    );
}

Prosess.defaultProps = {
    className: '',
};

Prosess.propTypes = {
    tittel: PT.string.isRequired,
    tekst: PT.string.isRequired,
    knappetekst: PT.string.isRequired,
    onClick: PT.func.isRequired,
    className: PT.string,
};

export default Prosess;
