import React from 'react';
import { useSelector } from 'react-redux';

import { Status } from '../../../../../createGenericSlice';
import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { isEksternAktivitet, VeilarbAktivitet } from '../../../../../datatypes/internAktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../../utils/dateUtils';
import { selectAktivitetStatus } from '../../../aktivitet-selector';
import KanIkkeLeggeTilForhaandsorienteringInfotekst from '../arena-aktivitet/KanIkkeLeggeTilForhaandsorienteringInfotekst';
import AvtaltForm from './AvtaltForm';
import ForhaandsorienteringForm from './ForhaandsorienteringForm';
import { Alert } from '@navikt/ds-react';

interface Props {
    aktivitet: VeilarbAktivitet;
    setSendtAtErAvtaltMedNav(): void;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const ManglerDatoerInfoTekst = () => {
    return (
        <Alert variant="info">
            Du kan ikke legge til forhåndsorientering fordi startdato og sluttdato ikke er satt.
        </Alert>
    );
};

const AvtaltFormContainer = (props: Props) => {
    const { aktivitet } = props;
    const nettverksStatus = useSelector(selectAktivitetStatus);

    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);
    const erEksternAktivitet = isEksternAktivitet(aktivitet);
    const manglerDatoer = !aktivitet.fraDato && !aktivitet.tilDato;

    if (erEksternAktivitet) {
        if (!aktivitet.avtalt) return null;
        if (manglerDatoer) return <ManglerDatoerInfoTekst />;
        if (mindreEnnSyvDagerTil) return <KanIkkeLeggeTilForhaandsorienteringInfotekst />;
        return <ForhaandsorienteringForm {...props} aktivitet={aktivitet} />;
    } else {
        return (
            <AvtaltForm
                lasterData={nettverksStatus !== Status.OK}
                mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                {...props}
            />
        );
    }
};

export default AvtaltFormContainer;
