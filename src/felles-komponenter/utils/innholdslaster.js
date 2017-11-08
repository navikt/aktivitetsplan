import React from 'react';
import PT from 'prop-types';
import Spinner from 'nav-frontend-spinner';
import { STATUS } from '../../ducks/utils';
import * as AppPT from '../../proptypes';
import HiddenIfHOC from '../../felles-komponenter/hidden-if/hidden-if';

const array = value => (Array.isArray(value) ? value : [value]);
const harStatus = (...status) => element =>
    element &&
    array(status).includes(
        typeof element === 'string' ? element : element.status
    );
const noenHarFeil = avhengigheter =>
    avhengigheter && array(avhengigheter).some(harStatus(STATUS.ERROR));
const minstEnErOK = avhengigheter =>
    avhengigheter && array(avhengigheter).some(harStatus(STATUS.OK));
const alleLastet = avhengigheter =>
    avhengigheter &&
    array(avhengigheter).every(harStatus(STATUS.OK, STATUS.RELOADING));

const HiddenIfSpinner = HiddenIfHOC(Spinner);

function Innholdslaster({
    avhengigheter,
    spinnerStorrelse,
    className,
    children,
    minstEn,
    visChildrenVedFeil,
}) {
    const visChildren =
        alleLastet(avhengigheter) ||
        (minstEn && minstEnErOK(avhengigheter)) ||
        (visChildrenVedFeil && noenHarFeil(avhengigheter));

    if (visChildren) {
        if (typeof children === 'function') {
            return children(avhengigheter);
        }
        if (Array.isArray(children)) {
            return (
                <div>
                    {children}
                </div>
            );
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
    minstEn: false,
    visChildrenVedFeil: false,
};

Innholdslaster.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    children: PT.oneOfType([PT.node, PT.func]).isRequired,
    className: PT.string,
    spinnerStorrelse: PT.string,
    minstEn: PT.bool,
    visChildrenVedFeil: PT.bool,
};

export default Innholdslaster;
