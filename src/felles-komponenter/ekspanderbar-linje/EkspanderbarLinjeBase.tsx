import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';
import { UnmountClosed } from 'react-collapse';

import VisibleIfDiv from '../utils/visible-if-div';
import styles from './EkspanderbarLinjeBase.module.less';

export interface PropsBase {
    tittel: string | React.ReactNode;
    aapneTittel?: string | React.ReactNode;
    children: React.ReactNode;
    kanToogle: boolean;
    aapneTekst: string;
    lukkeTekst: string;
    erAapen: boolean;
    onClick(): void;
}

const moveElementIntoView = (element: HTMLDivElement | null) => {
    // moves the element into view after the react-collapse animation is finished
    setTimeout(() => {
        element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 400);
};

const EkspanderbarLinjeBase = (props: PropsBase) => {
    const { tittel, aapneTittel, children, kanToogle, aapneTekst, lukkeTekst, onClick, erAapen } = props;

    const aapenRef = useRef(erAapen);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (erAapen && !aapenRef.current) {
            moveElementIntoView(contentRef.current);
        }
        aapenRef.current = erAapen;
    }, [erAapen]);

    const tittelUtifraState = erAapen && aapneTittel ? aapneTittel : tittel;
    const tittelKomponent =
        typeof tittelUtifraState === 'string' ? <BodyShort>{tittelUtifraState}</BodyShort> : tittelUtifraState;

    return (
        <section>
            <button onClick={onClick} className={styles.endreContainer} aria-expanded={erAapen} disabled={!kanToogle}>
                <div className={styles.endreVisning}>{tittelKomponent}</div>
                <VisibleIfDiv visible={kanToogle} className={styles.endreKnapp}>
                    <div className="inline-block pr-0.5">{erAapen ? lukkeTekst : aapneTekst}</div>
                    {erAapen ? (
                        <ChevronDownIcon fontSize="1.5rem" className="inline-block" />
                    ) : (
                        <ChevronUpIcon fontSize="1.5rem" className="inline-block" />
                    )}
                </VisibleIfDiv>
            </button>

            <UnmountClosed isOpened={erAapen}>
                <div ref={contentRef} className={styles.endreForm}>
                    {children}
                </div>
            </UnmountClosed>
        </section>
    );
};

export default EkspanderbarLinjeBase;
