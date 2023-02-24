import { Alert, Button, Heading } from '@navikt/ds-react';
import React from 'react';

import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';

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
        <section className="">
            <Heading level="2" size="small">
                Samtalereferat
            </Heading>
            <EkspanderbartTekstomrade className="oppdater-referat__referat" tekst={referat} antallTegn={275} />
            <HiddenIfDiv hidden={!erVeileder || !erAktivAktivitet} className="flex space-x-4">
                {erReferatPublisert ? (
                    <Alert variant="success" className="oppdater-referat-status">
                        Delt med bruker
                    </Alert>
                ) : (
                    <Button onClick={dispatchPubliserReferat} loading={publiserer}>
                        Del med bruker
                    </Button>
                )}
                <Button variant="secondary" onClick={startOppdaterReferat}>
                    Endre referat
                </Button>
            </HiddenIfDiv>
        </section>
    );
};

export default ReferatVisning;
