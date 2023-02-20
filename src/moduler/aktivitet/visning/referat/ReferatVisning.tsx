import { Alert, Button } from '@navikt/ds-react';
import classNames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';

import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import styles from './../Aktivitetsvisning.module.less';

interface Props {
    referat: string;
    erAktivAktivitet: boolean;
    erVeileder: boolean;
    dispatchPubliserReferat: () => void;
    publiserer: boolean;
    erReferatPublisert: boolean;
    startOppdaterReferat: () => void;
}

const ReferatVisning = (props: Props) => {
    const {
        erAktivAktivitet,
        referat,
        erVeileder,
        dispatchPubliserReferat,
        publiserer,
        erReferatPublisert,
        startOppdaterReferat,
    } = props;

    return (
        <div className={classNames('oppdater-referat', styles.underseksjon)}>
            <Undertittel>Samtalereferat</Undertittel>
            <EkspanderbartTekstomrade className="oppdater-referat__referat" tekst={referat} antallTegn={275} />
            <HiddenIfDiv hidden={!erVeileder || !erAktivAktivitet} className="oppdater-referat-knapper">
                <HiddenIfDiv hidden={erReferatPublisert}>
                    <Button onClick={dispatchPubliserReferat} loading={publiserer}>
                        Del med bruker
                    </Button>
                </HiddenIfDiv>
                <HiddenIfDiv hidden={!erReferatPublisert}>
                    <Alert variant="success" className="oppdater-referat-status">
                        Delt med bruker
                    </Alert>
                </HiddenIfDiv>
                <Button variant="tertiary" onClick={startOppdaterReferat}>
                    Endre referat
                </Button>
            </HiddenIfDiv>
        </div>
    );
};

export default ReferatVisning;
