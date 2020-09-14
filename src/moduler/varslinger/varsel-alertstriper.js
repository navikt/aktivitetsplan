import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import InternLenke from '../../felles-komponenter/utils/internLenke';
import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';
import Lenke from 'nav-frontend-lenker';

export function Varsling({ tekstId, className }) {
    return (
        <AlertStripeInfo className={className}>
            <FormattedMessage id={tekstId} />
        </AlertStripeInfo>
    );
}

Varsling.defaultProps = {
    className: '',
};

Varsling.propTypes = {
    tekstId: PT.string.isRequired,
    className: PT.string,
};

export function VarslingMedLenke({ tekstId, lenkeTekstId, href, className, onClick }) {
    return (
        <AlertStripeAdvarsel className={className}>
            <FormattedMessage id={tekstId} />
            &nbsp;
            <InternLenke href={href} onClick={onClick}>
                <FormattedMessage id={lenkeTekstId} />
            </InternLenke>
        </AlertStripeAdvarsel>
    );
}

VarslingMedLenke.defaultProps = {
    className: '',
    onClick: () => {},
};

VarslingMedLenke.propTypes = {
    tekstId: PT.string.isRequired,
    lenkeTekstId: PT.string.isRequired,
    href: PT.string.isRequired,
    className: PT.string,
    onClick: PT.func,
};

export function AdvarselVarsling({ tekst, className }) {
    return <AlertStripeAdvarsel className={className}>{tekst}</AlertStripeAdvarsel>;
}

AdvarselVarsling.defaultProps = {
    className: '',
};

AdvarselVarsling.propTypes = {
    tekst: PT.string.isRequired,
    className: PT.string,
};

export function AdvarselMedLenkeVarsling({ tekstId, lenkeTekstId, href, className, onClick, values }) {
    return (
        <AlertStripeAdvarsel className={className}>
            <FormattedMessage id={tekstId} values={values} />
            &nbsp;
            <Lenke href={href} onClick={onClick}>
                <FormattedMessage id={lenkeTekstId} />
            </Lenke>
        </AlertStripeAdvarsel>
    );
}

AdvarselMedLenkeVarsling.defaultProps = {
    className: '',
    onClick: () => {},
    values: undefined,
    erEksternLenke: false,
};

AdvarselMedLenkeVarsling.propTypes = {
    tekstId: PT.string.isRequired,
    lenkeTekstId: PT.string.isRequired,
    href: PT.string.isRequired,
    erEksternLenke: PT.bool,
    className: PT.string,
    onClick: PT.func,
    values: PT.object,
};

export const HiddenIfVarslingMedLenke = hiddenIf(VarslingMedLenke);
export const HiddenIfAdvarselMedLenke = hiddenIf(AdvarselMedLenkeVarsling);
