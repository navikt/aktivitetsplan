import { guid } from 'nav-frontend-js-utils';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useMemo, useState } from 'react';
import { UnmountClosed } from 'react-collapse';

import VisibleIfDiv from '../utils/visible-if-div';
import styles from './ekspanderbar-linje.module.less';

function moveElementIntoView(id: string) {
    // moves the element into view after the react-collapse animation is finished
    setTimeout(() => {
        (document.querySelector(`#${id}`) as any).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 400);
}

interface Props {
    tittel: string;
    children: React.ReactNode;
    kanToogle: boolean;
    aapneTekst: string;
    lukkeTekst: string;
    defaultAapen?: boolean;
}

function EkspanderbarLinje(props: Props) {
    const { tittel, children, kanToogle, aapneTekst, lukkeTekst, defaultAapen = false } = props;

    const [erAapen, setAapen] = useState(defaultAapen);
    //to get a valid css id it needs to start with a letter
    const unique = useMemo(() => 'a' + guid(), []);

    const togle = () => {
        setAapen(!erAapen);
        if (!erAapen) {
            moveElementIntoView(unique);
        }
    };

    return (
        <section>
            <button onClick={togle} className={styles.endreContainer} aria-expanded={erAapen} disabled={!kanToogle}>
                <div className={styles.endreVisning}>
                    <Normaltekst>{tittel}</Normaltekst>
                </div>
                <VisibleIfDiv visible={kanToogle} className={styles.endreKnapp}>
                    <div className={styles.endreKnappInnhold}>{erAapen ? lukkeTekst : aapneTekst}</div>
                    <div className={erAapen ? styles.endreIndikasjonLukket : styles.endreIndikasjonApen} />
                </VisibleIfDiv>
            </button>

            <UnmountClosed isOpened={erAapen}>
                <div id={unique} className={styles.endreForm}>
                    {children}
                </div>
            </UnmountClosed>
        </section>
    );
}

export default EkspanderbarLinje;
