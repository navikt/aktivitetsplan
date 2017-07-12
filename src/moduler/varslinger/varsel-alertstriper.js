import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
    AlertStripeAdvarsel,
    AlertStripeInfoSolid,
} from 'nav-frontend-alertstriper';
import Lenke from '../../felles-komponenter/utils/lenke';
import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';

export const Varsling = hiddenIf(({ tekstId, className }) =>
    <AlertStripeInfoSolid className={className}>
        <FormattedMessage id={tekstId} />
    </AlertStripeInfoSolid>
);

export const VarslingMedLenke = hiddenIf(
    ({ tekstId, lenkeTekstId, href, className }) =>
        <AlertStripeInfoSolid className={className}>
            <FormattedMessage id={tekstId} />&nbsp;
            <Lenke href={href}>
                <FormattedMessage id={lenkeTekstId} />
            </Lenke>
        </AlertStripeInfoSolid>
);

export const AdvarselVarsling = hiddenIf(({ tekstId, className }) =>
    <AlertStripeAdvarsel className={className}>
        <FormattedMessage id={tekstId} />
    </AlertStripeAdvarsel>
);
