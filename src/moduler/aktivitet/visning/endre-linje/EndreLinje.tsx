import { Accordion, Heading } from '@navikt/ds-react';
import PT from 'prop-types';
import React, { ReactNode, useMemo } from 'react';

import styles from './endre-linje.module.less';

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString()
        .substring(1);
}

function guid() {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

interface Props {
    tittel: string;
    form: ReactNode;
    subtittel: ReactNode;
    endring: boolean;
}

function EndreLinje(props: Props) {
    const { tittel, form, subtittel } = props;

    //to get a valid css id it needs to start with a letter
    const unique = useMemo(() => 'a' + guid(), []);

    return (
        <Accordion>
            <Accordion.Item>
                <Accordion.Header>
                    <div className="flex justify-between">
                        <div className={styles.endreVisning}>
                            <Heading size="small" level="2">
                                {tittel}
                            </Heading>
                            <div>{subtittel}</div>
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Content>
                    <div id={unique} className={styles.endreForm}>
                        {form}
                    </div>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
}

EndreLinje.propTypes = {
    tittel: PT.string.isRequired,
    form: PT.node.isRequired,
    endring: PT.bool.isRequired,
    kanEndre: PT.bool,
};

EndreLinje.defaultProps = {
    kanEndre: true,
};

export default EndreLinje;
