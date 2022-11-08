import { LinebreakRule } from '@navikt/textparser';
import classNames from 'classnames';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';
import Tekstomrade from 'nav-frontend-tekstomrade';
import React, { useState } from 'react';

import styles from './EkspanderbartTekstomrade.module.less';
import { ShortenedLinkRule } from './utils/rules';

interface ToggleBetweenDisplayingTruncatedOrFullTextProps {
    className: string;
    text: string;
    maxCharacters: number;
}

const ToggleBetweenDisplayingTruncatedOrFullText = (props: ToggleBetweenDisplayingTruncatedOrFullTextProps) => {
    const { className, text, maxCharacters } = props;
    const contentClassNames = classNames(className, styles.content);
    const [hasLongText, setHasLongText] = useState(true);
    const toggleMoreOrLess = () => {
        setHasLongText(!hasLongText);
    };
    if (text.length > maxCharacters) {
        return (
            <div className={contentClassNames}>
                <Tekstomrade className={styles.inline} rules={[LinebreakRule, ShortenedLinkRule]}>
                    {hasLongText ? text.slice(0, maxCharacters) + ' ... ' : text + ' '}
                </Tekstomrade>
                <Knapp onClick={toggleMoreOrLess} className={styles.button}>
                    {hasLongText ? 'Les mer' : 'Vis mindre'}
                    {hasLongText ? (
                        <NedChevron className={styles.padding} />
                    ) : (
                        <OppChevron className={styles.padding} />
                    )}
                </Knapp>
            </div>
        );
    }

    return (
        <Tekstomrade className={contentClassNames} rules={[ShortenedLinkRule]}>
            {text}
        </Tekstomrade>
    );
};

interface Props {
    className: string;
    tekst: string;
    antallTegn: number;
}

const EkspanderbartTekstomrade = (props: Props) => {
    const { className, tekst, antallTegn } = props;
    return <ToggleBetweenDisplayingTruncatedOrFullText className={className} text={tekst} maxCharacters={antallTegn} />;
};

export default EkspanderbartTekstomrade;
