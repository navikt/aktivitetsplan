import { Loader } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { Children, Component, ReactNode } from 'react';

import { Status } from '../../createGenericSlice';

function asArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}
const harStatus =
    (...status: string[]) =>
    (element: string): boolean =>
        asArray(status).includes(element);

const noenHarFeil = (avhengigheter: string[]): boolean => avhengigheter.some(harStatus(Status.ERROR));
export const minstEnErOK = (avhengigheter: string[]): boolean => avhengigheter.some(harStatus(Status.OK));
const alleLastet = (avhengigheter: string[]): boolean => avhengigheter.every(harStatus(Status.OK, Status.RELOADING));
const alleErOK = (avhengigheter: string[]): boolean => avhengigheter.every(harStatus(Status.OK));

export type Avhengighet = Status | { status?: Status } | null | undefined;
export interface InnholdslasterProps {
    avhengigheter?: Avhengighet[] | Avhengighet;
    children: ReactNode;
    spinnerSize?: '3xlarge' | '2xlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall';
    className?: string;
    minstEn?: boolean;
    visChildrenVedFeil?: boolean;
    alleOK?: boolean;
}

type InternStatus = Status | 'NOT_SETT';

export const toStatus = (avhengiheter?: Avhengighet[] | Avhengighet): InternStatus[] => {
    if (!avhengiheter) {
        return [];
    }

    return asArray(avhengiheter)
        .map((element) => (!element || typeof element === 'string' ? element : element.status))
        .map((element) => (element ? element : 'NOT_SETT'));
};

const Innholdslaster: React.FunctionComponent<InnholdslasterProps> = (props: InnholdslasterProps) => {
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
            return (children as (a: Avhengighet | Avhengighet[], rest: object) => ReactNode)(avhengigheter, rest);
        }
        if (Array.isArray(children)) {
            return children as ReactNode[];
        }
        return children as ReactNode;
    }

    if (noenHarFeil(statuser)) return null;
    return (
        <div className="flex-1 flex items-center justify-center">
            <Loader size={spinnerSize} className={classNames(className, 'm-3')} />
        </div>
    );
};

export default Innholdslaster;
