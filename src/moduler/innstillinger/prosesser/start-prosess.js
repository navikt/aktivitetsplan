import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';

const cls = classes => classNames('prosess', classes);

function Prosess({
    tittelId,
    knappetekstId,
    onClick,
    laster,
    disabled,
    className,
    children,
}) {
    return (
        <article className={cls(className)}>
            <Undertittel className="prosess_overskrift">
                <FormattedMessage id={tittelId} />
            </Undertittel>
            {children}
            <Knapp
                spinner={laster}
                autoDisableVedSpinner
                disabled={disabled}
                onClick={onClick}
            >
                <FormattedMessage id={knappetekstId} />
            </Knapp>
        </article>
    );
}

Prosess.defaultProps = {
    laster: false,
    className: '',
    disabled: false,
};

Prosess.propTypes = {
    tittelId: PT.string.isRequired,
    knappetekstId: PT.string.isRequired,
    onClick: PT.func.isRequired,
    laster: PT.bool,
    className: PT.string,
    children: PT.node.isRequired,
    disabled: PT.bool,
};

export default Prosess;
