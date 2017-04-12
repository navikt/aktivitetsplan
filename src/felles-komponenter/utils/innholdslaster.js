import React, { PropTypes as PT } from 'react';
import Spinner from 'nav-frontend-spinner';
import { STATUS } from '../../ducks/utils';

const array = (value) => (Array.isArray(value) ? value : [value]);
const harStatus = (...status) => (element) => array(status).includes(element.status);
const noenHarFeil = (avhengigheter) => avhengigheter && avhengigheter.some(harStatus(STATUS.ERROR));
const alleLastet = (avhengigheter) => avhengigheter && avhengigheter.every(harStatus(STATUS.OK, STATUS.RELOADING));
const medFeil = (avhengigheter) => avhengigheter.find(harStatus(STATUS.ERROR));

const Feilmelding = ({ children }) => <h1>FEIL: {children}</h1>; // eslint-disable-line react/prop-types

function Innholdslaster({ avhengigheter, spinnerStorrelse, className, children }) {
    if (alleLastet(avhengigheter)) {
        if (typeof children === 'function') {
            return children(avhengigheter);
        }
        return children;
    }

    if (noenHarFeil(avhengigheter)) {
        const feilendeReducer = medFeil(avhengigheter);
        console.log(feilendeReducer); // eslint-disable-line no-console

        const feilmelding = 'Det skjedde en feil ved innlastningen av data';

        return (
            <Feilmelding tittel="Oops" className={className}>
                <p>{feilmelding}</p>
            </Feilmelding>
        );
    }

    return <Spinner className={className} storrelse={spinnerStorrelse} />;
}

Innholdslaster.defaultProps = {
    spinnerStorrelse: 'xl'
};

Innholdslaster.propTypes = {
    avhengigheter: PT.arrayOf(PT.object).isRequired,
    children: PT.oneOfType([PT.node, PT.func]).isRequired,
    className: PT.string,
    spinnerStorrelse: PT.string
};

export default Innholdslaster;
