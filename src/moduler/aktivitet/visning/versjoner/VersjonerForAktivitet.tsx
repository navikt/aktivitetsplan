import { ReadMore } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';
import Innholdslaster from '../../../../felles-komponenter/utils/Innholdslaster';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import { fjernVersjoner, hentVersjonerForAktivtet } from '../../aktivitet-versjoner/aktivitet-versjoner-reducer';
import { selectSorterteVersjoner, selectVersjonerStatus } from '../../aktivitet-versjoner/aktivitet-versjoner-selector';
import VersjonInnslag from './VersjonInnslag';

const MAX_SIZE = 10;

interface Props {
    aktivitet: VeilarbAktivitet;
}

const VersjonerForAktivitet = (props: Props) => {
    const { aktivitet } = props;

    const dispatch = useAppDispatch();

    const versjoner = useSelector(selectSorterteVersjoner);
    const avhengighet = useSelector(selectVersjonerStatus);

    useEffect(() => {
        // TODO burde kanskje være en thunkdispatch det her?
        dispatch(fjernVersjoner());
        dispatch(hentVersjonerForAktivtet(aktivitet));
        return () => {
            dispatch(fjernVersjoner());
        };
    }, []);

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
