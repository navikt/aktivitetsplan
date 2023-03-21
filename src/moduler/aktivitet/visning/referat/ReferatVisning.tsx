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
        <section className="my-4 border-t pt-8">
            <Heading level="2" size="large" className="mb-4">
                Samtalereferat
            </Heading>
            <EkspanderbartTekstomrade tekst={referat} antallTegn={275} />
            <HiddenIfDiv hidden={!erVeileder || !erAktivAktivitet} className="flex flex-col mt-8 space-y-4">
                {erReferatPublisert ? (
                    <Alert variant="success" inline>
                        Delt med bruker
                    </Alert>
                ) : null}
                <div className="space-x-4">
                    <Button hidden={erReferatPublisert} onClick={dispatchPubliserReferat} loading={publiserer}>
                        Del med bruker
                    </Button>
                    <Button variant="secondary" onClick={startOppdaterReferat}>
                        Endre referat
                    </Button>
                </div>
            </HiddenIfDiv>
        </section>
    );
};

export default ReferatVisning;
