import { ReadMore } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import Innholdslaster from '../../../../felles-komponenter/utils/Innholdslaster';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import { selectSorterteVersjoner, selectVersjonerStatus } from '../../aktivitet-versjoner/aktivitet-versjoner-selector';
import VersjonInnslag from './VersjonInnslag';
import { selectAktivitetHistorikk } from '../../aktivitet-selector';
import { useParams } from 'react-router-dom';

const MAX_SIZE = 10;

interface Props {
    aktivitet: VeilarbAktivitet;
}

const VersjonerForAktivitet = (props: Props) => {
    const versjoner = useSelector(selectSorterteVersjoner);
    const aktivitetId = useParams<{ id: string }>().id;
    const historikk = useSelector((state) => selectAktivitetHistorikk(state, aktivitetId));
    const avhengighet = useSelector(selectVersjonerStatus);

    console.log({ historikk });

    const versjonerInnslag = versjoner
        .slice(0, MAX_SIZE)
        .map((versjon, index) => (
            <VersjonInnslag key={versjon.endretDato} aktivitet={versjon} forrigeAktivitet={versjoner[index + 1]} />
        ));

    const versjonerInnslagUnderAccordion = (
        <ReadMore header="Vis mer">
            {versjoner.slice(MAX_SIZE).map((versjon, index) => (
                <VersjonInnslag key={versjon.endretDato} aktivitet={versjon} forrigeAktivitet={versjoner[index + 1]} />
            ))}
        </ReadMore>
    );

    return (
        <Innholdslaster className="flex m-auto my-4" avhengigheter={avhengighet} spinnerSize="xlarge">
            <section>
                {versjonerInnslag}
                <VisibleIfDiv visible={versjoner.length > MAX_SIZE}>{versjonerInnslagUnderAccordion}</VisibleIfDiv>
            </section>
        </Innholdslaster>
    );
};

export default VersjonerForAktivitet;
