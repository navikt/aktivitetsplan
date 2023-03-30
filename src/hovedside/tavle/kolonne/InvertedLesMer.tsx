import { ReadMore } from '@navikt/ds-react';
import React, { useState } from 'react';
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

export const InvertedLestMer = (props: Props) => {
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
            <div>
                <ReadMore open={vis} onClick={toggle} header={vis ? lukkTekst : apneTekst} children={null} />
            </div>
            <Collapse isOpened={vis}>{vis ? children : null}</Collapse>
        </div>
    );
};

export default InvertedLestMer;
