import { ChevronDownCircle, ChevronUpCircle } from '@navikt/ds-icons';
import { LinebreakRule } from '@navikt/textparser';
import classNames from 'classnames';
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
                <Tekstomrade className="inline" rules={[LinebreakRule, ShortenedLinkRule]}>
                    {hasLongText ? text.slice(0, maxCharacters) + ' ... ' : text + ' '}
                </Tekstomrade>
                <Knapp onClick={toggleMoreOrLess} className={styles.button}>
                    {hasLongText ? 'Les mer' : 'Vis mindre'}
                    {hasLongText ? <ChevronDownCircle className="ml-0.5" /> : <ChevronUpCircle className="ml-0.5" />}
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
