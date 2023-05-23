import { BodyLong, Link } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface Props {
    children?: React.ReactNode;
    className?: string;
    size?: 'small' | 'medium';
    formatLinks?: boolean;
    formatLinebreaks?: boolean;
}

const linkRegex = /((?:[\w-]+:\/\/?|www(?:-\w+)?\.)[^\s()<>]+)/g;

const CustomBodyLong = (props: Props) => {
    const { children, className, size = 'medium', formatLinks = false, formatLinebreaks = false } = props;

    if (!children) {
        return null;
    }

    let newChildren: ReactNode[] = [children];

    if (formatLinks) {
        newChildren = newChildren.flatMap((el) => {
            if (typeof el === 'string') {
                return replaceMatchesWithNode(el, linkRegex, (value, index) => {
                    const href = value.toLowerCase().startsWith('www.') ? (value = `https://${value}`) : value;
                    return (
                        <Link target="_blank" href={value} key={`link-${index}`}>{`${value} (åpnes i ny fane)`}</Link>
                    );
                });
            }
            return el;
        });
    }

    const cls = classNames(className, formatLinebreaks && 'whitespace-pre-wrap');

    return (
        <BodyLong className={cls} size={size}>
            {newChildren}
        </BodyLong>
    );
};

const replaceMatchesWithNode = (
    text: string,
    regex: RegExp,
    mapFn: (value: string, index: number) => ReactNode
): ReactNode[] => {
    const matches = text.match(regex);
    const results = text.split(regex);

    if (matches !== null) {
        return results.map((value, index) => {
            if (matches.includes(value)) {
                return mapFn(value, index);
            }
            return value;
        });
    }
    return [text];
};

export default CustomBodyLong;
