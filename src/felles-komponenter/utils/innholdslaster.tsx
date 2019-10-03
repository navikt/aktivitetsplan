import React from 'react';
import Spinner from 'nav-frontend-spinner';
import { STATUS } from '../../ducks/utils';
import HiddenIfHOC from '../hidden-if/hidden-if';

const array = value => (Array.isArray(value) ? value : [value]);
const harStatus = (...status) => element =>
    element && array(status).includes(typeof element === 'string' ? element : element.status);
const noenHarFeil = avhengigheter => avhengigheter && array(avhengigheter).some(harStatus(STATUS.ERROR));
const minstEnErOK = avhengigheter => avhengigheter && array(avhengigheter).some(harStatus(STATUS.OK));
const alleLastet = avhengigheter => avhengigheter && array(avhengigheter).every(harStatus(STATUS.OK, STATUS.RELOADING));
const alleErOK = avhengigheter => avhengigheter && array(avhengigheter).every(harStatus(STATUS.OK));

const HiddenIfSpinner = HiddenIfHOC(Spinner);

interface Props {
    avhengigheter: string[] | object[];
    children: React.ReactNode;
    spinnerStorrelse?: string;
    className?: string;
    minstEn?: boolean;
    visChildrenVedFeil?: boolean;
    alleOK?: boolean;
}

function Innholdslaster(props: Props) {
    const {
        avhengigheter,
        spinnerStorrelse,
        className,
        children,
        minstEn,
        visChildrenVedFeil,
        alleOK,
        ...rest
    } = props;
    const visChildren = alleOK
        ? alleErOK(avhengigheter)
        : alleLastet(avhengigheter) ||
          (minstEn && minstEnErOK(avhengigheter)) ||
          (visChildrenVedFeil && noenHarFeil(avhengigheter));

    if (visChildren) {
        if (typeof children === 'function') {
            return children(avhengigheter, rest);
        }
        if (Array.isArray(children)) {
            return <div>{children}</div>;
        }
        return children;
    }

    return <HiddenIfSpinner hidden={noenHarFeil(avhengigheter)} className={className} type={spinnerStorrelse} />;
}

Innholdslaster.defaultProps = {
    spinnerStorrelse: 'XL',
    className: '',
    minstEn: false,
    visChildrenVedFeil: false,
    alleOK: false
};

export default Innholdslaster;
