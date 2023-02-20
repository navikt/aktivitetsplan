import { Alert } from '@navikt/ds-react';
import Lenke from 'nav-frontend-lenker';
import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';
import InternLenke from '../../felles-komponenter/utils/InternLenke';

export const Varsling = ({ tekstId, className }) => {
    return (
        <Alert variant="info" className={className}>
            <FormattedMessage id={tekstId} />
        </Alert>
    );
};

Varsling.defaultProps = {
    className: '',
};

Varsling.propTypes = {
    tekstId: PT.string.isRequired,
    className: PT.string,
};

export const VarslingMedLenke = ({ tekstId, lenkeTekstId, href, className, onClick }) => {
    return (
        <Alert variant="warning" className={className}>
            <FormattedMessage id={tekstId} />
            &nbsp;
            <InternLenke href={href} onClick={onClick}>
                <FormattedMessage id={lenkeTekstId} />
            </InternLenke>
        </Alert>
    );
};

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
    return (
        <Alert variant="warning" className={className}>
            {tekst}
        </Alert>
    );
}

AdvarselVarsling.defaultProps = {
    className: '',
};

AdvarselVarsling.propTypes = {
    tekst: PT.string.isRequired,
    className: PT.string,
};

export const AdvarselMedLenkeVarsling = ({ tekstId, lenkeTekstId, href, className, onClick, values }) => {
    return (
        <Alert variant="warning" className={className}>
            <FormattedMessage id={tekstId} values={values} />
            &nbsp;
            <Lenke href={href} onClick={onClick}>
                <FormattedMessage id={lenkeTekstId} />
            </Lenke>
        </Alert>
    );
};

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
