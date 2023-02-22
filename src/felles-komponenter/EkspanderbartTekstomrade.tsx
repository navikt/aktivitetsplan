import { Collapse, Expand } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { useState } from 'react';

import CustomBodyLong from '../moduler/aktivitet/visning/hjelpekomponenter/CustomBodyLong';
import styles from './EkspanderbartTekstomrade.module.less';

interface ToggleBetweenDisplayingTruncatedOrFullTextProps {
    className: string;
    text: string;
    maxCharacters: number;
}

const ToggleBetweenDisplayingTruncatedOrFullText = (props: ToggleBetweenDisplayingTruncatedOrFullTextProps) => {
    const { className, text, maxCharacters } = props;
    const contentClassNames = classNames(className);
    const [hasLongText, setHasLongText] = useState(true);
    const toggleMoreOrLess = () => {
        setHasLongText(!hasLongText);
    };
    if (text.length > maxCharacters) {
        return (
            <div className={contentClassNames}>
                <CustomBodyLong className="inline" formatLinks formatLinebreaks>
                    {hasLongText ? text.slice(0, maxCharacters) + ' ... ' : text + ' '}
                </CustomBodyLong>
                <Button variant={'tertiary'} onClick={toggleMoreOrLess} className={styles.button}>
                    {hasLongText ? 'Les mer' : 'Vis mindre'}
                    {hasLongText ? <Expand className="ml-0.5 inline" /> : <Collapse className="ml-0.5 inline" />}
                </Button>
            </div>
        );
    }

    return (
        <div className={contentClassNames}>
            <CustomBodyLong formatLinks formatLinebreaks>
                {text}
            </CustomBodyLong>
        </div>
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
