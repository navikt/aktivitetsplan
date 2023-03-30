import { Alert, Button, Heading } from '@navikt/ds-react';
import React from 'react';

import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import { useErVeileder } from '../../../../Provider';

interface Props {
    referat: string;
    erAktivAktivitet: boolean;
    dispatchPubliserReferat: () => void;
    publiserer: boolean;
    erReferatPublisert: boolean;
    startOppdaterReferat: () => void;
}

const ReferatVisning = (props: Props) => {
    const erVeileder = useErVeileder();
    const { erAktivAktivitet, referat, dispatchPubliserReferat, publiserer, erReferatPublisert, startOppdaterReferat } =
        props;

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
