import Spinner from 'nav-frontend-spinner';
import React from 'react';

import { STATUS } from '../../api/utils';
import HiddenIfHOC from '../hidden-if/hidden-if';

function asArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}
const harStatus = (...status: string[]) => (element: string): boolean => asArray(status).includes(element);

const noenHarFeil = (avhengigheter: string[]): boolean => avhengigheter.some(harStatus(STATUS.ERROR));
const minstEnErOK = (avhengigheter: string[]): boolean => avhengigheter.some(harStatus(STATUS.OK));
const alleLastet = (avhengigheter: string[]): boolean => avhengigheter.every(harStatus(STATUS.OK, STATUS.RELOADING));
const alleErOK = (avhengigheter: string[]): boolean => avhengigheter.every(harStatus(STATUS.OK));

const HiddenIfSpinner = HiddenIfHOC(Spinner);

export type Avhengighet = Status | { status?: Status } | null | undefined;
export interface InnholdslasterProps {
    avhengigheter?: Avhengighet[] | Avhengighet;
    children: React.ReactNode;
    spinnerStorrelse?: string;
    className?: string;
    minstEn?: boolean;
    visChildrenVedFeil?: boolean;
    alleOK?: boolean;
}

type Status = 'NOT_STARTED' | 'PENDING' | 'OK' | 'RELOADING' | 'ERROR';
type InternStatus = Status | 'NOT_SETT';

const toStatus = (avhengiheter?: Avhengighet[] | Avhengighet): InternStatus[] => {
    if (!avhengiheter) {
        return [];
    }

    return asArray(avhengiheter)
        .map((element) => (!element || typeof element === 'string' ? element : element.status))
        .map((element) => (element ? element : 'NOT_SETT'));
};

const Innholdslaster = (props: InnholdslasterProps) => {
    const {
        avhengigheter,
        spinnerStorrelse = 'XL',
        className,
        children,
        minstEn = false,
        visChildrenVedFeil = false,
        alleOK = false,
        ...rest
    } = props;

    const statuser = toStatus(avhengigheter);

    const visChildren = alleOK
        ? alleErOK(statuser)
        : alleLastet(statuser) || (minstEn && minstEnErOK(statuser)) || (visChildrenVedFeil && noenHarFeil(statuser));

    if (visChildren) {
        if (typeof children === 'function') {
            return children(avhengigheter, rest);
        }
        if (Array.isArray(children)) {
            return <div>{children}</div>;
        }
        return children;
    }

    return <HiddenIfSpinner hidden={noenHarFeil(statuser)} className={className} type={spinnerStorrelse} />;
};

export default Innholdslaster;
