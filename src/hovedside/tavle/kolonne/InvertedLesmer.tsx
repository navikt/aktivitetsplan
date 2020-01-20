import React, { useState } from 'react';
import LesMerToggle from 'nav-frontend-lesmerpanel/lib/lesmerpanelToggle';
import { Collapse } from 'react-collapse';
import style from './InvertedLesMer.module.less';

interface Props {
    apneTekst: string;
    lukkTekst: string;
    hidden?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    children: React.ReactNode;
}

export default function InvertedLestMer(props: Props) {
    const [vis, setVis] = useState(false);
    const toggle = () => {
        if (vis) {
            props.onClose && props.onClose();
        } else {
            props.onOpen && props.onOpen();
        }
        setVis(!vis);
    };

    const { apneTekst, lukkTekst, hidden, children } = props;

    if (hidden) {
        return null;
    }

    return (
        <div className={style.invertedLesMer}>
            <div className={style.toggle}>
                <LesMerToggle erApen={vis} onClick={toggle} apneTekst={apneTekst} lukkTekst={lukkTekst} />
            </div>
            <Collapse isOpened={vis}>{children}</Collapse>
        </div>
    );
}
