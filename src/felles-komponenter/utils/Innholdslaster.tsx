import { Loader } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';

import { STATUS } from '../../api/utils';

function asArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}
const harStatus =
    (...status: string[]) =>
    (element: string): boolean =>
        asArray(status).includes(element);

const noenHarFeil = (avhengigheter: string[]): boolean => avhengigheter.some(harStatus(STATUS.ERROR));
export const minstEnErOK = (avhengigheter: string[]): boolean => avhengigheter.some(harStatus(STATUS.OK));
const alleLastet = (avhengigheter: string[]): boolean => avhengigheter.every(harStatus(STATUS.OK, STATUS.RELOADING));
const alleErOK = (avhengigheter: string[]): boolean => avhengigheter.every(harStatus(STATUS.OK));

export type Avhengighet = Status | { status?: Status } | null | undefined;
export interface InnholdslasterProps {
    avhengigheter?: Avhengighet[] | Avhengighet;
    children: React.ReactNode;
    spinnerSize?: '3xlarge' | '2xlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall';
    className?: string;
    minstEn?: boolean;
    visChildrenVedFeil?: boolean;
    alleOK?: boolean;
}

export type Status = 'NOT_STARTED' | 'PENDING' | 'OK' | 'RELOADING' | 'ERROR';
type InternStatus = Status | 'NOT_SETT';

export const toStatus = (avhengiheter?: Avhengighet[] | Avhengighet): InternStatus[] => {
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
        spinnerSize = '2xlarge',
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
            return children;
        }
        return children;
    }

    if (noenHarFeil(statuser)) return null;
    return (
        <div className="flex-1 flex items-center justify-center">
            <Loader size={spinnerSize} className={classNames(className, 'm-3')} />
        </div>
    );
};

export default Innholdslaster;
