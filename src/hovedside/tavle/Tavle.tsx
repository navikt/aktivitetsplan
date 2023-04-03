import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import React, { ReactElement, useRef, useState } from 'react';

import SprettendeScrollbars from './sprettende-scrollbars';

const KOLONNEBREDDE = 325;
const KOLONNEMARGIN = 10;

interface Props {
    children: ReactElement[];
    dragging: boolean;
}

const Tavle = (props: Props) => {
    const { children, dragging } = props;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [clickIndex, setClickIndex] = useState(0);
    const [venstreKnappDisabled, setVenstreKnappDisabled] = useState(true);
    const [hoyreKnappDisabled, setHoyreKnappDisabled] = useState(false);

    const scrollbars = useRef<SprettendeScrollbars>(null);

    const visForrige = () => {
        const newClickIndex = Math.min(currentIndex, clickIndex) - 1;
        const scrollTo = newClickIndex * KOLONNEBREDDE;
        scrollbars.current?.scrollLeft(scrollTo);
        setClickIndex(newClickIndex);
    };

    const visNeste = () => {
        if (!scrollbars.current) {
            return;
        } else {
            const clientWidth = scrollbars.current.getClientWidth();
            const scrollLeft = scrollbars.current.getScrollLeft();
            const clientWidthWithOffset = clientWidth! + KOLONNEMARGIN;
            const nesteIndex = Math.floor((clientWidthWithOffset + scrollLeft!) / KOLONNEBREDDE);
            const newClickIndex = Math.max(nesteIndex, clickIndex) + 1;
            const scrollTo = newClickIndex * KOLONNEBREDDE - clientWidthWithOffset;
            scrollbars.current?.scrollLeft(scrollTo);
            setClickIndex(newClickIndex);
        }
    };

    const updateState = (values: { scrollLeft: number; left: number }) => {
        setCurrentIndex(Math.ceil(values.scrollLeft / KOLONNEBREDDE));
        setVenstreKnappDisabled(values.left === 0);
        setHoyreKnappDisabled(values.left >= 0.99);
    };

    const kolonner = children.map((child, index) => (
        <section
            key={child.key || index}
            className={'min-w-[300px] lg:max-w-[300px]'}
            data-testid={`aktivitetstavle.${child.props.status}`}
        >
            {child}
        </section>
    ));

    const venstreKnapp = (
        <button
            type="button"
            className={classNames('tavle__scrollknapp knapp-forrige border', {
                invisible: venstreKnappDisabled,
            })}
            onClick={visForrige}
            disabled={venstreKnappDisabled}
            aria-label="Flytt visning en kolonne til venstre"
        >
            <ChevronLeftIcon title="Forrige kolonne" fontSize="4rem" />
        </button>
    );

    const hoyreKnapp = (
        <button
            type="button"
            className={classNames('tavle__scrollknapp knapp-neste border', {
                invisible: hoyreKnappDisabled,
            })}
            onClick={visNeste}
            hidden={hoyreKnappDisabled}
            aria-label="Flytt visning en kolonne til høyre"
        >
            <ChevronRightIcon title="Neste kolonne" fontSize="4rem" />
        </button>
    );

    return (
        <section className={classNames('tavle aktivitetstavle lg:w-full')} tabIndex={-1}>
            {venstreKnapp}
            <SprettendeScrollbars autoHeight autoHeightMax={9999} onScrollFrame={updateState} ref={scrollbars}>
                <div
                    className="kolonner flex flex-col sm:gap-y-6 sm:mx-8 sm:max-w-[624px] sm:mx-auto md:max-w-[720px]
                                lg:flex-row lg:gap-x-5 lg:mx-4 lg:max-w-full tavle-max-width:justify-center"
                >
                    {kolonner}
                </div>
            </SprettendeScrollbars>
            {hoyreKnapp}
        </section>
    );
};

export default Tavle;
