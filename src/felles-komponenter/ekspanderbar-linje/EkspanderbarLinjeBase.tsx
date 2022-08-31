import { Normaltekst } from 'nav-frontend-typografi';
import React, { useEffect, useRef } from 'react';
import { UnmountClosed } from 'react-collapse';

import VisibleIfDiv from '../utils/visible-if-div';
import styles from './EkspanderbarLinjeBase.module.css';

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
        typeof tittelUtifraState === 'string' ? <Normaltekst>{tittelUtifraState}</Normaltekst> : tittelUtifraState;

    return (
        <section>
            <button onClick={onClick} className={styles.endreContainer} aria-expanded={erAapen} disabled={!kanToogle}>
                <div className={styles.endreVisning}>{tittelKomponent}</div>
                <VisibleIfDiv visible={kanToogle} className={styles.endreKnapp}>
                    <div className={styles.endreKnappInnhold}>{erAapen ? lukkeTekst : aapneTekst}</div>
                    <div className={erAapen ? styles.endreIndikasjonLukket : styles.endreIndikasjonApen} />
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
