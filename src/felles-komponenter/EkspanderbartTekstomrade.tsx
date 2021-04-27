import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import React, { useState } from 'react';

import styles from './EkspanderbartTekstomrade.module.less';

const MoreOrLess = ({ text, maxCharacters }: { text: string; maxCharacters: number }) => {
    const [hasLongText, setHasLongText] = useState(true);
    const toggleMoreOrLess = () => {
        setHasLongText(!hasLongText);
    };
    if (text.length > maxCharacters) {
        return (
            <p>
                {hasLongText ? text.slice(0, maxCharacters) + ' ... ' : text + ' '}
                <span className={styles.nobreak}>
                    <span className={styles.color}>
                        <span onClick={toggleMoreOrLess} className={styles.padding}>
                            {hasLongText ? 'Les mer' : 'Vis mindre'}
                        </span>
                        {hasLongText ? <NedChevron /> : <OppChevron />}
                    </span>
                </span>
            </p>
        );
    } else {
        return <p>{text}</p>;
    }
};

interface Props {
    tekst: string;
    antallTegn: number;
    className: string;
}

const EkspanderbartTekstomrade = (props: Props) => {
    const { tekst, antallTegn, className } = props;
    return (
        <div className={className}>
            <MoreOrLess text={tekst} maxCharacters={antallTegn} />
        </div>
    );
};

export default EkspanderbartTekstomrade;
