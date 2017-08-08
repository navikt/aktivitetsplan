import React from 'react';
import PT from 'prop-types';
import Spinner from 'nav-frontend-spinner';
import { STATUS } from '../../ducks/utils';
import HiddenIfHOC from '../../felles-komponenter/hidden-if/hidden-if';

const array = value => (Array.isArray(value) ? value : [value]);
const harStatus = (...status) => element =>
    array(status).includes(
        typeof element === 'string' ? element : element.status
    );
const noenHarFeil = avhengigheter =>
    avhengigheter && avhengigheter.some(harStatus(STATUS.ERROR));
const alleLastet = avhengigheter =>
    avhengigheter &&
    avhengigheter.every(harStatus(STATUS.OK, STATUS.RELOADING));

const HiddenIfSpinner = HiddenIfHOC(Spinner);

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

    return (
        <HiddenIfSpinner
            hidden={noenHarFeil(avhengigheter)}
            className={className}
            storrelse={spinnerStorrelse}
        />
    );
}

Innholdslaster.defaultProps = {
    spinnerStorrelse: 'xl',
    className: '',
};

Innholdslaster.propTypes = {
    avhengigheter: PT.arrayOf(PT.oneOfType([PT.object, PT.string])).isRequired,
    children: PT.oneOfType([PT.node, PT.func]).isRequired,
    className: PT.string,
    spinnerStorrelse: PT.string,
};

export default Innholdslaster;
