import { Back, Next } from '@navikt/ds-icons';
import classNames from 'classnames';
import React, { ReactElement, useRef, useState } from 'react';

const KOLONNEBREDDE = 300;
const KOLONNEMARGIN = 10;
interface Props {
    children: ReactElement[];
    dragging: boolean;
}

const Tavle2 = (props: Props) => {
    const { children, dragging } = props;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [clickIndex, setClickIndex] = useState(0);
    const [venstreKnappDisabled, setVenstreKnappDisabled] = useState(true);
    const [hoyreKnappDisabled, setHoyreKnappDisabled] = useState(false);

    const kolonnerRef = useRef<HTMLElement[]>([]);
    const scrollContainer = useRef<HTMLElement | null>(null);

    const visForrige = () => {
        const kolonne = kolonnerRef.current.at(0);
        if (!kolonne) {
            console.log('No kolonne');
            return;
        }
        // kolonne?.scrollIntoView({ behavior: 'smooth', inline: 'end' });
        scrollContainer.current?.scrollTo(kolonne.offsetLeft, 0);
        setVenstreKnappDisabled(true);
        setHoyreKnappDisabled(false);
    };

    const visNeste = () => {
        const kolonne = kolonnerRef.current.at(-1);
        if (!kolonne) {
            console.log('No kolonne');
            return;
        }
        console.log('Scroller til', kolonne);
        // kolonne?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        scrollContainer.current?.scrollTo(kolonne.offsetLeft, 0);
        setVenstreKnappDisabled(false);
        setHoyreKnappDisabled(true);
    };

    const venstreKnapp = (
        <button
            className={classNames('tavle__scrollknapp knapp-forrige', {
                invisible: venstreKnappDisabled,
            })}
            onClick={visForrige}
            disabled={venstreKnappDisabled}
            aria-label="Flytt visning en kolonne til venstre"
        >
            <Back className="knapp-forrige-ikon" aria-describedby="Forrige kolonne" role="img" focusable="false" />
        </button>
    );

    const hoyreKnapp = (
        <button
            className={classNames('tavle__scrollknapp knapp-neste', {
                invisible: hoyreKnappDisabled,
            })}
            onClick={visNeste}
            hidden={hoyreKnappDisabled}
            aria-label="Flytt visning en kolonne til høyre"
        >
            <Next className="knapp-neste-ikon" aria-describedby="Neste kolonne" role="img" focusable="false" />
        </button>
    );

    console.log(kolonnerRef);

    return (
        <section
            className={classNames('tavle aktivitetstavle lg:max-w-[992px]', { 'opacity-50': dragging })}
            tabIndex={-1}
            ref={scrollContainer}
        >
            {venstreKnapp}
            <div className="kolonner flex flex-col lg:flex-row overflow-x-scroll lg:gap-3">
                {children.map((child, index) => (
                    <section
                        key={child.key || index}
                        className="lg:min-w-[292px]"
                        data-testid={`aktivitetstavle.${child.props.status}`}
                        ref={(ref) => {
                            if (!ref) return;
                            kolonnerRef.current[index] = ref;
                        }}
                    >
                        {child}
                    </section>
                ))}
            </div>
            {hoyreKnapp}
        </section>
    );
};

export default Tavle2;
