import { Alert, Button, Heading, HelpText, Tag } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import { useErVeileder } from '../../../../Provider';
import { selectPubliserReferatFeil } from '../../../feilmelding/feil-selector';
import Feilmelding from '../../../feilmelding/Feilmelding';
import { useSamtalereferatKladd } from '../../aktivitet-forms/samtalereferat/useSamtalereferatKladd';

interface Props {
    aktivitetId: string;
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

    const feil = useSelector(selectPubliserReferatFeil);

    const { hentSamtaleReferatKladdLagretAktivitet } = useSamtalereferatKladd({ aktivitetId: props.aktivitetId });
    const kladd = hentSamtaleReferatKladdLagretAktivitet();

    return (
        <section className="my-4 border-t border-ax-border-neutral pt-8">
            <div className="flex justify-between">
                <Heading level="2" size="large" className="mb-4">
                    Samtalereferat
                </Heading>
                {kladd ? (
                    <div className="flex gap-2 items-center mb-4">
                        <Tag data-color="meta-purple">Referatet inneholder en kladd</Tag>
                        <HelpText title="Hvor kommer dette fra?">
                            Du har en ulagret kladd på dette referatet i nettleseren. Vi har tatt vare på den for deg
                            😉. Klikk 'Endre referat' for å se den ulagrede endringen.
                        </HelpText>
                    </div>
                ) : null}
            </div>
            <EkspanderbartTekstomrade tekst={referat} antallTegn={275} />
            {!erAktivAktivitet && !erReferatPublisert ? (
                <Button hidden={erReferatPublisert} onClick={dispatchPubliserReferat} loading={publiserer}>
                    Del med bruker
                </Button>
            ) : null}
            <HiddenIfDiv hidden={!erVeileder || !erAktivAktivitet} className="flex flex-col mt-8 space-y-4">
                {erReferatPublisert ? (
                    <Alert variant="success" inline>
                        Delt med bruker
                    </Alert>
                ) : null}
                <Feilmelding feilmeldinger={feil} />
                <div className="flex gap-4">
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
