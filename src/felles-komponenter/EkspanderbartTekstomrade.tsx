import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';

import styles from './EkspanderbartTekstomrade.module.less';

interface MoreOrLessProps {
    className: string;
    text: string;
    maxCharacters: number;
}

const MoreOrLess = (props: MoreOrLessProps) => {
    const { className, text, maxCharacters } = props;
    const [hasLongText, setHasLongText] = useState(true);
    const toggleMoreOrLess = () => {
        setHasLongText(!hasLongText);
    };
    if (text.length > maxCharacters) {
        return (
            <Normaltekst className={className}>
                {hasLongText ? text.slice(0, maxCharacters) + ' ... ' : text + ' '}
                <Knapp onClick={toggleMoreOrLess} className={styles.button}>
                    {hasLongText ? 'Les mer' : 'Vis mindre'}
                    {hasLongText ? (
                        <NedChevron className={styles.padding} />
                    ) : (
                        <OppChevron className={styles.padding} />
                    )}
                </Knapp>
            </Normaltekst>
        );
    }
    return <Normaltekst className={className}>{text}</Normaltekst>;
};

interface Props {
    klasseNavn: string;
    tekst: string;
    antallTegn: number;
}

const EkspanderbartTekstomrade = (props: Props) => {
    const { tekst, antallTegn, klasseNavn } = props;
    return <MoreOrLess className={klasseNavn} text={tekst} maxCharacters={antallTegn} />;
};

export default EkspanderbartTekstomrade;
