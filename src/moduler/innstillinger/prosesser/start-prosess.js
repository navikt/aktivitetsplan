import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';

const cls = classes => classNames('start-prosess', classes);

function Prosess({
    tittel,
    knappetekst,
    onClick,
    laster,
    className,
    children,
}) {
    return (
        <article className={cls(className)}>
            <Undertittel>
                {tittel}
            </Undertittel>
            {children}
            <Knapp mini spinner={laster} disabled={laster} onClick={onClick}>
                {knappetekst}
            </Knapp>
        </article>
    );
}

Prosess.defaultProps = {
    laster: false,
    className: '',
};

Prosess.propTypes = {
    tittel: PT.string.isRequired,
    knappetekst: PT.string.isRequired,
    onClick: PT.func.isRequired,
    laster: PT.bool,
    className: PT.string,
    children: PT.node.isRequired,
};

export default Prosess;
