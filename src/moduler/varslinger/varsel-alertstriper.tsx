import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';
import InternLenke from '../../felles-komponenter/utils/InternLenke';

interface VarslingProps {
    tekstId: string,
    className: string
}

export function Varsling({ tekstId, className }: VarslingProps) {
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

interface VarslingMedLenkeProps extends VarslingProps {
    lenkeTekstId: string,
    href: string,
    onClick: () => void
}

export function VarslingMedLenke({ tekstId, lenkeTekstId, href, className, onClick }: VarslingMedLenkeProps) {
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

interface AdvarselVarslingProps {
    tekst: string,
    className: string
}

export function AdvarselVarsling({ tekst, className }: AdvarselVarslingProps) {
    return <AlertStripeAdvarsel className={className}>{tekst}</AlertStripeAdvarsel>;
}

AdvarselVarsling.defaultProps = {
    className: '',
};

AdvarselVarsling.propTypes = {
    tekst: PT.string.isRequired,
    className: PT.string,
};

interface AdvarselMedLenkeVarsling extends VarslingMedLenkeProps {
    values: Record<string, string>
}

export function AdvarselMedLenkeVarsling({ tekstId, lenkeTekstId, href, className, onClick, values }: AdvarselMedLenkeVarsling) {
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

export const HiddenIfAdvarselMedLenke = hiddenIf(AdvarselMedLenkeVarsling);
