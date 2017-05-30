import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Spinner from 'nav-frontend-spinner';
import { STATUS } from '../../ducks/utils';

const array = value => (Array.isArray(value) ? value : [value]);
const harStatus = (...status) => element =>
    array(status).includes(element.status);
const noenHarFeil = avhengigheter =>
    avhengigheter && avhengigheter.some(harStatus(STATUS.ERROR));
const alleLastet = avhengigheter =>
    avhengigheter &&
    avhengigheter.every(harStatus(STATUS.OK, STATUS.RELOADING));

const tekster = {
    feilmeldingTittel: {
        id: 'innholdslaster.feilmelding.tittel',
        defaultMessage: 'Oops, det skjedde noe feil...',
    },
    feilmeldingTekst: {
        id: 'innholdslaster.feilmelding.tekst',
        defaultMessage: 'Det skjedde en feil ved innlastning av data fra baksystemene',
    },
};

// eslint-disable-next-line react/prop-types
const Feilmelding = ({ tittel, children }) => (
    <div>
        <h1>{tittel}</h1>
        <p>{children}</p>
    </div>
);

function Innholdslaster({
    avhengigheter,
    spinnerStorrelse,
    className,
    children,
}) {
    if (alleLastet(avhengigheter)) {
        if (typeof children === 'function') {
            return children(avhengigheter);
        }
        return children;
    }

    if (noenHarFeil(avhengigheter)) {
        return (
            <Feilmelding
                className={className}
                tittel={<FormattedMessage {...tekster.feilmeldingTittel} />}
            >
                <FormattedMessage {...tekster.feilmeldingTekst} />
            </Feilmelding>
        );
    }

    return <Spinner className={className} storrelse={spinnerStorrelse} />;
}

Innholdslaster.defaultProps = {
    spinnerStorrelse: 'xl',
};

Innholdslaster.propTypes = {
    avhengigheter: PT.arrayOf(PT.object).isRequired,
    children: PT.oneOfType([PT.node, PT.func]).isRequired,
    className: PT.string,
    spinnerStorrelse: PT.string,
};

export default Innholdslaster;
