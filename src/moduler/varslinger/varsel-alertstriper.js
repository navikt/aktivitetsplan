import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
    AlertStripeAdvarsel,
    AlertStripeInfoSolid,
} from 'nav-frontend-alertstriper';
import Lenke from '../../felles-komponenter/utils/lenke';
import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';

export function Varsling({ tekstId, className }) {
    return (
        <AlertStripeInfoSolid className={className}>
            <FormattedMessage id={tekstId} />
        </AlertStripeInfoSolid>
    );
}

Varsling.defaultProps = {
    className: '',
};

Varsling.propTypes = {
    tekstId: PT.string.isRequired,
    className: PT.string,
};

export function VarslingMedLenke({ tekstId, lenkeTekstId, href, className }) {
    return (
        <AlertStripeInfoSolid className={className}>
            <FormattedMessage id={tekstId} />&nbsp;
            <Lenke href={href}>
                <FormattedMessage id={lenkeTekstId} />
            </Lenke>
        </AlertStripeInfoSolid>
    );
}

VarslingMedLenke.defaultProps = {
    className: '',
};

VarslingMedLenke.propTypes = {
    tekstId: PT.string.isRequired,
    lenkeTekstId: PT.string.isRequired,
    href: PT.string.isRequired,
    className: PT.string,
};

export function AdvarselVarsling({ tekstId, className }) {
    return (
        <AlertStripeAdvarsel className={className}>
            <FormattedMessage id={tekstId} />
        </AlertStripeAdvarsel>
    );
}

AdvarselVarsling.defaultProps = {
    className: '',
};

AdvarselVarsling.propTypes = {
    tekstId: PT.string.isRequired,
    className: PT.string,
};

export const HiddenIfVarsling = hiddenIf(Varsling);
export const HiddenIfVarslingMedLenke = hiddenIf(VarslingMedLenke);
export const HiddenIfAdvarselVarsling = hiddenIf(AdvarselVarsling);
