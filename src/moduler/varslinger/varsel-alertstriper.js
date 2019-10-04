import React from 'react';
import PT from 'prop-types';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from '../../felles-komponenter/utils/lenke';
import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';

export function VarslingMedLenke({ tekst, lenkeTekst, href, className, onClick }) {
    return (
        <AlertStripeAdvarsel className={className}>
            {tekst}
            &nbsp;
            <Lenke href={href} onClick={onClick}>
                {lenkeTekst}
            </Lenke>
        </AlertStripeAdvarsel>
    );
}

VarslingMedLenke.defaultProps = {
    className: '',
    onClick: () => {}
};

VarslingMedLenke.propTypes = {
    tekst: PT.string.isRequired,
    lenkeTekst: PT.string.isRequired,
    href: PT.string.isRequired,
    className: PT.string,
    onClick: PT.func
};

export function AdvarselVarsling({ tekst, className }) {
    return <AlertStripeAdvarsel className={className}>{tekst}</AlertStripeAdvarsel>;
}

AdvarselVarsling.defaultProps = {
    className: ''
};

AdvarselVarsling.propTypes = {
    tekst: PT.string.isRequired,
    className: PT.string
};

export function AdvarselMedLenkeVarsling({ tekst, lenkeTekst, href, erEksternLenke, className, onClick, values }) {
    return (
        <AlertStripeAdvarsel className={className}>
            {tekst}
            &nbsp;
            <Lenke href={href} onClick={onClick} erEksternLenke={erEksternLenke}>
                {lenkeTekst}
            </Lenke>
        </AlertStripeAdvarsel>
    );
}

AdvarselMedLenkeVarsling.defaultProps = {
    className: '',
    onClick: () => {},
    erEksternLenke: false
};

AdvarselMedLenkeVarsling.propTypes = {
    tekst: PT.string.isRequired,
    lenkeTekst: PT.string.isRequired,
    href: PT.string.isRequired,
    erEksternLenke: PT.bool,
    className: PT.string,
    onClick: PT.func
};

export const HiddenIfVarslingMedLenke = hiddenIf(VarslingMedLenke);
export const HiddenIfAdvarselMedLenke = hiddenIf(AdvarselMedLenkeVarsling);
